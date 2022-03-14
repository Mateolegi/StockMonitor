import { Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { SearchBar } from 'react-native-elements';

import StockCard from '../components/StockCard/StockCard';
import { useThemeColor, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { Stock, StockHistory } from '../types';
import { LAST, VALUES_PER_KEY } from '../constants/Endpoints';
import { ScrollView } from 'react-native-gesture-handler';
import { fetchDataFailure as fetchDataFailureLast, fetchDataSuccess as fetchDataSuccessLast, stocksSelector } from '../reducers/fetchLastApiSlice';
import { fetchDataSuccess as fetchDataSuccessValuePerKey, fetchDataFailure as fetchDataFailureValuePerKey } from '../reducers/fetchValuesPerKeyApiSlice';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const dispatch = useAppDispatch();
  const stocks = useAppSelector(stocksSelector);
  const [stockState, setStockState] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");

  const fetchLastValues = () => {
    fetch(LAST)
      .then(res => res.json())
      .then(json => {
        const stockList: Stock[] = [];
        for (let key in json) {
          stockList.push(json[key]);
        }
        return stockList;
      })
      .then((json: Stock[]) => {
        dispatch(fetchDataSuccessLast(json));
        setStockState(json);
        json.forEach(stock => fetchValuesPerKey(stock.key));
      })
      .catch(() => dispatch(fetchDataFailureLast()));
  };

  const fetchValuesPerKey = (key: string) => {
    fetch(VALUES_PER_KEY.replaceAll(':key', key))
      .then(res => res.json())
      .then((stockHistory: StockHistory) => {
        dispatch(fetchDataSuccessValuePerKey(stockHistory));
      })
      .catch(() => dispatch(fetchDataFailureValuePerKey()));
  };

  useEffect(() => {
    // TODO: Separar lógica del componente de vista
    fetchLastValues();
  }, []);

  const updateSearch = (text: string): void => {
    setSearch(text);
    setStockState(stocks.filter(stock => stock.name.toLowerCase().includes(text.toLowerCase()) 
                                      || stock.key.toLowerCase().includes(text.toLowerCase())));
  };

  const renderStockCard = (stock: Stock) => {
    return <StockCard key={stock.key} keyApi={stock.key}/>;
  };

  return (
    <ScrollView>
      <SearchBar
        placeholder="Search"
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
        onChangeText={updateSearch}
        value={search}
        style={styles.searchBar}
        containerStyle={{backgroundColor: useThemeColor({ light: '#fff', dark: '#000' }, 'background')}}
        inputContainerStyle={{backgroundColor: useThemeColor({ light: '#e6e6e6', dark: '#1c1c1c' }, 'background')}}
        inputStyle={{color: useThemeColor({ light: '#000', dark: '#8c8c8c' }, 'text')}}
      />
      <View>
        {stockState.map(renderStockCard)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    width: '100%',
  },
});
