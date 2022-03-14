import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../Themed';
import { useAppSelector } from '../../hooks/reduxHooks';
import { stockHistorySelector } from '../../reducers/fetchValuesPerKeyApiSlice';

const StockCard = ({keyApi}: {keyApi: string}) => {

  const navigation = useNavigation();
  const stockHistoryState = useAppSelector(stockHistorySelector);
  const [percentDifference, setPercentDifference] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    const stockHistory = stockHistoryState.find(stock => stock.key === keyApi);
    if (stockHistory) {
      setName(stockHistory.name);
      setUnit(stockHistory.unit);
      const values = stockHistory.values;
      const orderedValues = Object.keys(values).map(key => key * 1).sort((a, b) => a - b);
      const previousTimestamp = orderedValues[orderedValues.length - 2];
      const currentTimestamp = orderedValues[orderedValues.length - 1];

      setCurrentValue(values[currentTimestamp]);
      setPercentDifference(((values[currentTimestamp] - values[previousTimestamp]) / values[previousTimestamp]) * 100);
    }
  } , [stockHistoryState]);

  const transformedValue = (value: number) => {
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
      <View style={styles.row}>
        <View style={[styles.column, { flex: 2 }]}>
          <Text style={styles.textBold}>{keyApi.toUpperCase()}</Text>
          <Text style={styles.textSmall}>{name}</Text>
        </View>
        <View style={[styles.column, { flex: 1, alignItems: 'flex-end' }]}>
          <Text style={styles.textBold}>{transformedValue(currentValue)}</Text>
          <Text style={[styles.textNormal, percentDifference > 0 ? {color: 'green'} : {color: 'red'}]}>{percentDifference.toFixed(2)}%</Text>
        </View>
      </View>
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