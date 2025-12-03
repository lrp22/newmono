import { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";

export default function TodosScreen() {
  const { data: session } = authClient.useSession();
  const [text, setText] = useState("");

  // 1. Fetch Data
  const { data: todos, isLoading, error } = useQuery(
    orpc.todo.list.queryOptions({
      // Only fetch if logged in
      enabled: !!session, 
    })
  );

  // 2. Mutations
  const createTodo = useMutation(
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        setText("");
        // Invalidate the list to refetch
        queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() });
      },
      onError: (err) => Alert.alert("Error", err.message),
    })
  );

  const toggleTodo = useMutation(
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() }),
    })
  );

  const deleteTodo = useMutation(
    orpc.todo.delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.todo.list.key() }),
    })
  );

  const handleAdd = () => {
    if (!text.trim()) return;
    createTodo.mutate({ text });
  };

  // If not logged in
  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="lock-closed-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-900 mt-4">Login Required</Text>
        <Text className="text-gray-500 text-center mt-2">
          Please sign in on the Home tab to manage your todos.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">My Todos</Text>
        <Text className="text-gray-500 text-sm">Keep track of your tasks</Text>
      </View>

      {/* Input Area */}
      <View className="p-4">
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-base"
            placeholder="What needs to be done?"
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAdd}
          />
          <Pressable 
            onPress={handleAdd}
            disabled={createTodo.isPending}
            className={`w-12 items-center justify-center rounded-xl ${createTodo.isPending ? 'bg-gray-400' : 'bg-black'}`}
          >
            {createTodo.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="arrow-up" size={24} color="white" />
            )}
          </Pressable>
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="px-4 pb-20 gap-3"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 opacity-50">
              <Ionicons name="clipboard-outline" size={64} color="gray" />
              <Text className="text-gray-500 mt-4">No todos yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Pressable 
                onPress={() => toggleTodo.mutate({ id: item.id, completed: !item.completed })}
                className="flex-row items-center flex-1 gap-3"
              >
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {item.completed && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text 
                  className={`text-base flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                  numberOfLines={1}
                >
                  {item.text}
                </Text>
              </Pressable>
              
              <Pressable 
                onPress={() => deleteTodo.mutate({ id: item.id })}
                className="p-2 bg-red-50 rounded-lg ml-2"
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}