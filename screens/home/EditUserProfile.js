import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_600SemiBold,
} from "@expo-google-fonts/bricolage-grotesque";
import useAuthStore from "../src/store/useAuthStore";

export default function EditUserProfile({ navigation }) {

 const CLOUD_NAME = "dkbnefodj"; 
 const UPLOAD_PRESET = "kawxffis"; 
 const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const { user } = useAuthStore();
  const [image, setImage] = useState(null);
  const [dob] = useState(new Date(1995, 4, 23));
  const [phone, setPhone] = useState(user?.phone || "");
  

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("Nigeria");
  const [items, setItems] = useState([
    { label: "Nigeria", value: "Nigeria" },
    { label: "Ghana", value: "Ghana" },
    { label: "Kenya", value: "Kenya" },
    { label: "South Africa", value: "South Africa" },
    { label: "Egypt", value: "Egypt" },
    { label: "USA", value: "USA" },
    { label: "UK", value: "UK" },
    { label: "Canada", value: "Canada" },
    { label: "Germany", value: "Germany" },
    { label: "France", value: "France" },
    { label: "Italy", value: "Italy" },
    { label: "China", value: "China" },
    { label: "Japan", value: "Japan" },
    { label: "India", value: "India" },
    { label: "Brazil", value: "Brazil" },
    { label: "Mexico", value: "Mexico" },
    { label: "Spain", value: "Spain" },
    { label: "Australia", value: "Australia" },
    { label: "Russia", value: "Russia" },
    { label: "UAE", value: "UAE" },
    { label: "Saudi Arabia", value: "Saudi Arabia" },
    { label: "Turkey", value: "Turkey" },
    { label: "Morocco", value: "Morocco" },
    { label: "Argentina", value: "Argentina" },
    { label: "Chile", value: "Chile" },
    { label: "Ethiopia", value: "Ethiopia" },
    { label: "Uganda", value: "Uganda" },
    { label: "Cameroon", value: "Cameroon" },
    { label: "Senegal", value: "Senegal" },
    { label: "Ivory Coast", value: "Ivory Coast" },
  ]);

  let [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5E239D" />
      </View>
    );
  }

const pickImage = async () => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    // Launch picker (using backward-compatible MediaTypeOptions)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      // Prepare upload to Cloudinary
      let formData = new FormData();
      formData.append("file", {
        uri: localUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });
      formData.append("upload_preset", UPLOAD_PRESET);

      let uploadResponse = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      let uploadResult = await uploadResponse.json();
      if (uploadResult.secure_url) {
        setImage(uploadResult.secure_url);
      } else {
        console.error(uploadResult);
        alert("Failed to upload image");
      }
    }
  } catch (error) {
    console.error("Image pick/upload error:", error);
    alert("Something went wrong while selecting/uploading image.");
  }
};
const saveChanges = async () => {
  try {
    const token = useAuthStore.getState().token; 

    if (!token) {
      alert("You are not logged in. Please log in again.");
      return;
    }

    const response = await fetch("https://odara-app.onrender.com/api/auth/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone,
        country,
        profileImage: image, 
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      
      useAuthStore.setState({ user: data.user });
      setImage(data.user.profileImage);

      alert("Profile updated successfully!");
    } else {
      alert(data.message || "Error updating profile");
    }
  } catch (error) {
    console.error("Save error", error);
    alert("Something went wrong.");
  }
};





  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <View style={styles.imageBorder}>
          <Image
            source={image ? { uri: image } : require("../../assets/img/slide3.png")}
            style={styles.profileImage}
          />
        </View>
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Ionicons name="camera" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={[styles.input, styles.disabledInput]} value={user?.name || ""} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email || ""}
          editable={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput style={[styles.input, styles.disabledInput]} value="********" editable={false} secureTextEntry />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity style={[styles.input, styles.disabledInput]} disabled>
          <Text style={styles.dateText}>{dob.toLocaleDateString("en-GB")}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Country/Region</Text>
        <DropDownPicker
          open={open}
          value={country}
          items={items}
          setOpen={setOpen}
          setValue={setCountry}
          setItems={setItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          placeholder="Select country"
          showTickIcon={true}
          listMode="SCROLLVIEW"
          zIndex={1000}
          zIndexInverse={1000}
        />

       <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
  <Text style={styles.saveButtonText}>Save changes</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: { 
    padding: 20, 
    backgroundColor: "#fff", 
    flexGrow: 1,
    paddingBottom: 40
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30, 
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  backButton: {
    width: 30, 
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "BricolageGrotesque_600SemiBold",
    textAlign: "center",
    flex: 1, 
    marginHorizontal: 10, 
  },
  headerSpacer: {
    width: 30, 
  },
  profileImageContainer: { 
    alignItems: "center", 
    marginBottom: 20 
  },
  imageBorder: { 
    borderWidth: 2, 
    borderColor: "#130225ff", 
    borderRadius: 60, 
    padding: 3 
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 130,
    backgroundColor: "#130225ff",
    borderRadius: 15,
    padding: 5,
  },
  form: { 
    marginTop: 10 
  },
  label: {
    fontSize: 14,
    fontFamily: "BricolageGrotesque_400Regular",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontFamily: "BricolageGrotesque_400Regular",
    height: 45,
  },
  disabledInput: { 
    backgroundColor: "#f0f0f0", 
    color: "#999" 
  },
  dateText: { 
    fontFamily: "BricolageGrotesque_400Regular", 
    color: "#555" 
  },
  
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 45,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: "BricolageGrotesque_400Regular",
  },
  saveButton: {
    backgroundColor: "#2c0655ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "BricolageGrotesque_600SemiBold",
    fontSize: 16,
  },
});