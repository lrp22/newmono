import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [isSignUp, setIsSignUp] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        await authClient.signUp.email(
          {
            email,
            password,
            name,
          },
          {
            onSuccess: () => {
              Alert.alert("Success", "Account created!");
              refetch(); // Refresh session
            },
            onError: (ctx) => Alert.alert("Error", ctx.error.message),
          }
        );
      } else {
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onSuccess: () => {
              refetch(); // Refresh session
            },
            onError: (ctx) => Alert.alert("Error", ctx.error.message),
          }
        );
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    refetch();
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // LOGGED IN VIEW
  if (session) {
    return (
      <SafeAreaView className="flex-1 bg-white p-6 items-center justify-center">
        <View className="bg-blue-50 p-6 rounded-2xl w-full items-center mb-6">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1">
            Welcome back!
          </Text>
          <Text className="text-lg font-medium text-blue-600 mb-1">
            {session.user.name}
          </Text>
          <Text className="text-sm text-gray-500">{session.user.email}</Text>
        </View>

        <Pressable
          onPress={handleSignOut}
          className="w-full bg-gray-100 py-4 rounded-xl items-center active:bg-gray-200"
        >
          <Text className="text-gray-900 font-semibold">Sign Out</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // LOGGED OUT VIEW
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow justify-center p-6">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Text>
            <Text className="text-gray-500">
              {isSignUp
                ? "Sign up to start your journey"
                : "Sign in to continue"}
            </Text>
          </View>

          <View className="gap-4">
            {isSignUp && (
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
                />
              </View>
            )}

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
              />
            </View>

            <Pressable
              onPress={handleAuth}
              disabled={loading}
              className="w-full bg-black py-4 rounded-xl items-center mt-4 active:opacity-90"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              )}
            </Pressable>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-500">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
              </Text>
              <Pressable onPress={() => setIsSignUp(!isSignUp)}>
                <Text className="text-blue-600 font-bold">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
