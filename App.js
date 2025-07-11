import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';

const Stack = createStackNavigator();
const API_KEY = 'YOUR_ACCESS_TOKEN_HERE';

function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.printify.com/v1/shops.json', {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
      .then(res => res.json())
      .then(shops => {
        const shopId = shops[0]?.id;
        return fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
      })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { product: item })} style={styles.card}>
      <Image source={{ uri: item?.images?.[0]?.src }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>CICADA 3301 Store</Text>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

function ProductDetails({ route }) {
  const { product } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: product?.images?.[0]?.src }} style={styles.imageLarge} />
      <Text style={styles.title}>{product.title}</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 16 },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 10, marginBottom: 12, alignItems: 'center' },
  image: { width: 180, height: 180, borderRadius: 10 },
  imageLarge: { width: '100%', height: 300, borderRadius: 10, marginBottom: 20 },
  title: { color: '#fff', fontSize: 16, marginTop: 10, textAlign: 'center' }
});