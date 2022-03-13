import { FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, SearchBar } from 'react-native-elements';

import StockCard from '../components/StockCard/StockCard';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchDataFailure, fetchDataSuccess, stocksSelector } from '../reducers/fetchLastApiSlice';
import { Stock } from '../types';
import { LAST } from '../constants/Endpoints';
import { ScrollView } from 'react-native-gesture-handler';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const stocks = useAppSelector(stocksSelector);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(LAST)
      .then(res => res.json())
      .then(json => {
        const stockList: Stock[] = [];
        for (let key in json) {
          stockList.push(json[key]);
        }
        return stockList;
      })
      .then((json: Stock[]) => dispatch(fetchDataSuccess(json)))
      .catch(() => dispatch(fetchDataFailure()));
  }, []);

  const updateSearch = (text: string): void => {
    setSearch(text);
  };

  const renderStockCard = (stock: Stock) => {
    return <StockCard key={stock.key} keyApi={stock.key} name={stock.name} unit={stock.unit} value={stock.value} />;
  };

  return (
    <ScrollView>
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
        style={{ width: '100%' }}
      />
      <View>
        {stocks.map(renderStockCard)}
      </View>
    </ScrollView>
    // <View style={styles.container}>
    //   <SearchBar
    //     placeholder="Search"
    //     onChangeText={updateSearch}
    //     value={search}
    //     style={{ width: '100%' }}
    //   />
    //   <FlatList
    //     data={stocks}
    //     renderItem={({ item }) => renderStockCard(item)}
    //     keyExtractor={item => item.key}
    //     style={{ width: '100%' }}
    //   />
    //   {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
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
