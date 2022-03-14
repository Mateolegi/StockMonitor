import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Avatar, ButtonGroup, LinearProgress } from 'react-native-elements';

import { Text, useThemeColor, View } from '../components/Themed';
import { useAppSelector } from '../hooks/reduxHooks';
import { stockHistorySelector } from '../reducers/fetchValuesPerKeyApiSlice';

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

export default function StockModalScreen({ route, navigation }) {

  const { keyApi }: {keyApi: string} = route.params;
  const screenWidth = Dimensions.get("window").width;

  const stockHistory = useAppSelector(stockHistorySelector);
  const [stockHistoryState, setStockHistoryState] = useState<StockHistoryState | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const chartConfig = {
    backgroundGradientFrom: useThemeColor({ light: '#FCFCFC', dark: '#171717' }, 'background'),
    backgroundGradientTo: useThemeColor({ light: '#FCFCFC', dark: '#171717' }, 'background'),
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(118, 118, 118, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(118, 118, 118, ${opacity})`,
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
    const stockHistoryVal = stockHistory.find(stock => stock.key === keyApi);
    if (stockHistoryVal) {
      const labels = [];
      const values = [];
      const stockHistoryValue = stockHistoryVal.values;
      for (let key in stockHistoryValue) {
        labels.push(new Date(key * 1000));
        values.push(stockHistoryValue[key]);
      }
      setStockHistoryState({
        labels,
        values,
        unit: stockHistoryVal.unit,
        name: stockHistoryVal.name,
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
          legend: [stockHistoryVal.name],
        }
      })
    }
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

  const handleIndexChange = (index: number) => {
    let labels: Date[] | string[] | undefined = stockHistoryState?.labels;
    let values = stockHistoryState?.values;
    if (index === 1 && labels) {
      labels = labels.slice(labels.length - 20, labels.length)
                 .map(label => label.getFullYear().toString());
      values = values?.slice(values.length - 20, values.length);
    } else if (index === 2 && labels) {
      labels = labels.slice(labels.length - 5, labels.length)
                 .map((label: Date) => label.toLocaleDateString());
      values = values?.slice(values.length - 5, values.length);
    } else {
      labels = labels?.map(label => label.getFullYear().toString());
    }
    setStockHistoryState({
      ...stockHistoryState,
      data: {
        ...stockHistoryState?.data,
        labels: labels?.filter((value, i, self) => self.indexOf(value) === i),
        datasets: [
          {
            data: values,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      }
    });
  };

  const onChangeIndex = (index: number) => {
    setSelectedIndex(index);
    handleIndexChange(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{keyApi.toUpperCase()}</Text>
        <Text style={styles.normalText}>{stockHistoryState?.name}</Text>
        <View>
          <Avatar
            size={40}
            rounded
            onPress={() => navigation.goBack()}
            icon={{ name: 'times', type: 'font-awesome' }}
            containerStyle={{ backgroundColor: '#3b3b3b' }}
          />
        </View>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.header}>
        <Text style={styles.title}>{}</Text>
        <Text style={styles.normalText}>{stockHistoryState?.name}</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ButtonGroup
        buttons={['Todos', 'Últimos 20', 'Últimos 5']}
        selectedIndex={selectedIndex}
        onPress={onChangeIndex}
        containerStyle={{
          marginBottom: 20, borderWidth: 0,
          backgroundColor: useThemeColor({ light: '#fff', dark: '#000' }, 'background')
        }}
        buttonContainerStyle={{ borderRightWidth: 0 }}
        buttonStyle={{
          backgroundColor: useThemeColor({ light: '#fff', dark: '#000' }, 'background'),
        }}
        textStyle={{ color: useThemeColor({ light: '#000', dark: '#fff' }, 'text') }}
        selectedButtonStyle={{
          backgroundColor: useThemeColor({ light: '#e6e6e6', dark: '#242424' }, 'background'),
          borderRadius: 10,
        }}
        selectedTextStyle={{ color: useThemeColor({ light: '#000', dark: '#fff' }, 'text') }}
      />
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
          withDots={selectedIndex === 0 ? false : true}
        />
        :
        <View style={{ height: 400 }}>
          <LinearProgress style={{ marginVertical: 10 }} color="red" />
        </View>
      }
      
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
    marginLeft: 30,
    width: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginRight: 10,
  },
  normalText: {
    fontSize: 14,
    maxWidth: '70%',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '93%',
  },
});
