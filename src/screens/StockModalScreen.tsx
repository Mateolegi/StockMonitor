import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { ButtonGroup, LinearProgress } from 'react-native-elements';

import { Text, View } from '../components/Themed';
import { VALUES_PER_KEY } from '../constants/Endpoints';
import { useAppDispatch } from '../hooks/reduxHooks';
import { fetchDataFailure } from '../reducers/fetchValuesPerKeyApiSlice';
import { StockHistory } from '../types';

interface StockHistoryState {
  labels: Date[];
  values: number[];
  unit: string;
  name: string;
  data: {
    labels: string[] | undefined;
    datasets: {
      data: number[] | undefined;
      color: (opacity: number) => string;
      strokeWidth: number;
    }[];
    legend: string[];
  };
}

export default function StockModalScreen({ route }) {

  const { keyApi } = route.params;
  const dispatch = useAppDispatch();
  const screenWidth = Dimensions.get("window").width;

  const [stockHistoryState, setStockHistoryState] = useState<StockHistoryState | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const chartConfig = {
    backgroundGradientFrom: "#FEFEFE",
    backgroundGradientTo: "#FEFEFE",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "1",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(VALUES_PER_KEY.replaceAll(':key', keyApi), { signal })
      .then(res => res.json())
      .then((stockHistory: StockHistory) => {
        const labels = [];
        const values = [];
        const stockHistoryValue = stockHistory.values;
        if (stockHistoryValue) {
          for (let key in stockHistoryValue) {
            labels.push(new Date(key * 1000));
            values.push(stockHistoryValue[key]);
          }
        }
        setStockHistoryState({
          labels,
          values,
          unit: stockHistory.unit,
          name: stockHistory.name,
          data: {
            labels: labels
              .map(label => label.getFullYear().toString())
              .filter((value, index, self) => self.indexOf(value) === index),
            datasets: [
              {
                data: values,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: [stockHistory.name],
          }
        })
      })
      .catch(() => dispatch(fetchDataFailure()));
    return () => controller.abort();
  }, []);

  const transformedValue = (value: string): string => {
    switch (stockHistoryState?.unit) {
      case 'dolar':
      case 'pesos':
        return '$' + value;
      case 'porcentual':
        return value + '%';
      default:
        return value;
    };
  };

  const onChangeIndex = (index: number) => {
    console.log(index);
    
    setSelectedIndex(index);
    switch (index) {
      case 0:
        setStockHistoryState({
          ...stockHistoryState,
          data: {
            ...stockHistoryState?.data,
            labels: stockHistoryState?.labels
              .map(label => label.getFullYear().toString())
              .filter((value, index, self) => self.indexOf(value) === index),
            datasets: [
              {
                ...stockHistoryState?.data.datasets[0],
                data: stockHistoryState?.values,
              },
            ],
          }
        });
        break;
      case 1:
        console.log('ahora pasa por aqui');
        
        setStockHistoryState({
          ...stockHistoryState,
          data: {
            ...stockHistoryState?.data,
            labels: stockHistoryState?.labels
              .slice(stockHistoryState?.labels.length - 20, stockHistoryState?.labels.length)
              .map(label => label.getFullYear().toString())
              .filter((value, index, self) => self.indexOf(value) === index),
            datasets: [
              {
                ...stockHistoryState?.data.datasets[0],
                data: stockHistoryState?.values
                  .slice(stockHistoryState?.values.length - 20, stockHistoryState?.values.length),
              },
            ],
          }
        });
        break;
      case 2:
        console.log('pasa por aqui');
        
        setStockHistoryState({
          ...stockHistoryState,
          data: {
            ...stockHistoryState?.data,
            labels: stockHistoryState?.labels
              .slice(stockHistoryState?.labels.length - 5, stockHistoryState?.labels.length)
              .map(label => label.toString())
              .filter((value, index, self) => self.indexOf(value) === index),
            datasets: [
              {
                ...stockHistoryState?.data.datasets[0],
                data: stockHistoryState?.values
                  .slice(stockHistoryState?.values.length - 5, stockHistoryState?.values.length),
              },
            ],
          }
        });
        break;
    }
  };

  return (
    <View style={styles.container}>
      {stockHistoryState?.data ? 
        <LineChart
          data={stockHistoryState.data}
          width={screenWidth}
          height={400}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          yAxisInterval={1} // optional, defaults to 1
          formatYLabel={transformedValue}
          bezier
          segments={6}
          style={{
            marginVertical: 8,
            marginHorizontal: 15,
            borderRadius: 16
          }}
          withDots={false}
        />
        :
        <View style={{ height: 400 }}>
          <LinearProgress style={{ marginVertical: 10 }} color="red" />
        </View>
      }
      <ButtonGroup
        buttons={['Todos', 'Últimos 20', 'Últimos 5']}
        selectedIndex={selectedIndex}
        onPress={onChangeIndex}
        containerStyle={{ marginBottom: 20 }}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
