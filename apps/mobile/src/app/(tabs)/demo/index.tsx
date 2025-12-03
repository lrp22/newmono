import { Text, View, Alert, ScrollView, Pressable } from "react-native";
import { Button, Card } from "@app/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Demo() {
  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 py-6"
      >
        {/* Header Section */}
        <View className="items-center mb-8">
          <View className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl items-center justify-center mb-4">
            <Text className="text-2xl">🎨</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Shared UI Components
          </Text>
          <Text className="text-gray-600 mb-4 text-center">
            Cross-platform components built with React Native and NativeWind
          </Text>
          <View className="bg-purple-100 px-3 py-1 rounded-full">
            <Text className="text-purple-800 text-sm font-medium">
              📱 Mobile App
            </Text>
          </View>
        </View>

        {/* Component Showcase */}
        <View className="gap-6">
          {/* Button Component */}
          <Card variant="elevated">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Button
            </Text>
            <View className="gap-3">
              <Button
                title="Primary Button"
                onPress={() =>
                  Alert.alert("Success", "Works natively on mobile!")
                }
              />
              <Button
                title="Secondary Button"
                variant="secondary"
                onPress={() =>
                  Alert.alert("Info", "Same component, different style")
                }
              />
            </View>
          </Card>

          {/* Card Component */}
          <Card variant="elevated">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Card
            </Text>
            <Card variant="default">
              <Text className="text-gray-700 text-sm">
                This nested card demonstrates consistent spacing and styling
                across platforms. The same component works identically on web.
              </Text>
            </Card>
          </Card>

          {/* How It Works */}
          <Card>
            <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                How It Works
              </Text>
              <Text className="text-gray-600 text-sm mb-4 leading-5">
                Components use React Native primitives (View, Text, Pressable)
                with NativeWind for styling. React Native Web transforms these
                into HTML elements for the browser.
              </Text>

              <View className="flex-row gap-3">
                <View className="flex-1 bg-white p-3 rounded border border-blue-100">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-blue-600">🌐</Text>
                    <Text className="font-medium text-blue-900 text-sm">
                      Web
                    </Text>
                  </View>
                  <Text className="text-blue-700 text-xs">
                    React Native Web → HTML
                  </Text>
                </View>

                <View className="flex-1 bg-white p-3 rounded border border-purple-100">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-purple-600">📱</Text>
                    <Text className="font-medium text-purple-900 text-sm">
                      Mobile
                    </Text>
                  </View>
                  <Text className="text-purple-700 text-xs">
                    Native iOS/Android
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Navigation */}
        <View className="items-center mt-8 gap-4">
          <Link href="/(tabs)/(home)" asChild>
            <Pressable className="bg-blue-600 px-6 py-2 rounded-lg active:opacity-80">
              <View className="flex-row items-center gap-2">
                <Text className="text-white text-sm">🏠</Text>
                <Text className="text-white font-medium text-sm">
                  Back to Home
                </Text>
              </View>
            </Pressable>
          </Link>

          <Text className="text-sm text-gray-500 text-center">
            Try the web app to see identical components in action
          </Text>
        </View>

        {/* Footer */}
        <View className="mt-8">
          <Card>
            <Text className="text-gray-600 text-center text-sm">
              Same components • Different platforms • One codebase
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
