import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../Themed';
import { Card } from 'react-native-elements';

interface Props {
  keyApi: string;
  name: string;
  description?: string;
  value: number;
  unit: string;
}

const StockCard = ({keyApi, name, description, value, unit}: Props) => {

  const navigation = useNavigation();

  const transformedValue = () => {
    switch (unit) {
      case 'dolar':
      case 'pesos':
        return '$' + value;
      case 'porcentual':
        return value + '%';
      default:
        return value;
    };
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Modal', { keyApi: keyApi })}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <Card containerStyle={{width: '100%'}}> */}
        <View style={styles.row}>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.textBold}>{keyApi.toUpperCase()}</Text>
            <Text style={styles.textSmall}>{name}</Text>
          </View>
          <View style={[styles.column, { flex: 1, alignItems: 'flex-end' }]}>
            <Text style={styles.textBold}>{transformedValue()}</Text>
            { description && <Text style={styles.textNormal}>{name}</Text> }
          </View>
        </View>
      {/* </Card> */}
    </TouchableOpacity>
  );
};

export default StockCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    width: '93%',
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 20
  },
  textNormal: {
    fontSize: 18
  },
  textSmall: {
    fontSize: 15
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: '100%',
  },
})