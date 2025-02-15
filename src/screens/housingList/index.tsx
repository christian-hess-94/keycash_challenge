/* eslint-disable react-hooks/exhaustive-deps */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Button, View, ScrollView} from 'react-native';
import {ScreenStackParamList} from '..';
import Card from '../../components/card';
import {CardTextItem, CardTextPrice} from '../../components/card/styles';
import {StyledTextInput} from '../../components/housingInfo/styles';
import {Row} from '../../components/layout/styles';
import PaginationHeader from '../../components/paginationHeader';
import useHousing from '../../contexts/housing.context';
import usePagination from '../../contexts/pagination.context';
import {Housing} from '../../interfaces/housing.interfaces';
import {priceMask} from '../../utils/masks.utils';
import {Picker} from '@react-native-picker/picker';
import {StyledPicker, StyledPickerContainer, StyledPickerText} from './styles';

const HousingListScreen: React.FC<
  NativeStackScreenProps<ScreenStackParamList, 'HousingListScreen'>
> = ({navigation: {navigate}}) => {
  const handleSeeFullDetails = (selectedHousing: Housing) => {
    navigate('HousingDetailsScreen', {selectedHousing});
  };

  const {itemsPerPage, currentPage, setItemsPerPage, calculateNumberOfPages} =
    usePagination();

  const {
    housingFilters,
    setHousingFilters,
    handleApplyFilters,
    filteredHousingArray,
  } = useHousing();

  useEffect(() => {
    handleApplyFilters();
  }, []);

  return (
    <ScrollView>
      <Card title={`Filters (${filteredHousingArray.length})`}>
        <StyledTextInput
          value={housingFilters.filterFormattedAddress}
          placeholder="Address"
          onChangeText={filterFormattedAddress =>
            setHousingFilters({...housingFilters, filterFormattedAddress})
          }
        />
        <Row>
          <StyledTextInput
            value={housingFilters.filterBathrooms}
            placeholder="Bathrooms (max)"
            onChangeText={filterBathrooms =>
              setHousingFilters({...housingFilters, filterBathrooms})
            }
            keyboardType="number-pad"
          />
          <StyledTextInput
            value={housingFilters.filterBedrooms}
            placeholder="Bedrooms (max)"
            onChangeText={filterBedrooms =>
              setHousingFilters({...housingFilters, filterBedrooms})
            }
            keyboardType="number-pad"
          />
        </Row>
        <Row>
          <StyledTextInput
            value={housingFilters.filterUsableArea}
            placeholder="Usable Area (min)"
            onChangeText={filterUsableArea =>
              setHousingFilters({...housingFilters, filterUsableArea})
            }
            keyboardType="number-pad"
          />
          <StyledTextInput
            value={housingFilters.filterPrice}
            placeholder="Price (min)"
            onChangeText={filterPrice =>
              setHousingFilters({...housingFilters, filterPrice})
            }
            keyboardType="number-pad"
          />
        </Row>
        <StyledTextInput
          value={housingFilters.filterParkingSpaces}
          placeholder="Parking Spaces (min)"
          onChangeText={filterParkingSpaces =>
            setHousingFilters({...housingFilters, filterParkingSpaces})
          }
          keyboardType="number-pad"
        />
        <StyledPickerContainer>
          <StyledPickerText>Nº of items per page</StyledPickerText>
          <StyledPicker
            selectedValue={itemsPerPage}
            onValueChange={itemValue => {
              setItemsPerPage(itemValue);
              calculateNumberOfPages(filteredHousingArray, itemValue);
            }}>
            <Picker.Item label="5" value="5" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="15" value="15" />
          </StyledPicker>
        </StyledPickerContainer>
        <Button title="Apply Filters" onPress={handleApplyFilters} />
      </Card>
      <PaginationHeader />
      {filteredHousingArray
        .slice(
          currentPage * parseInt(itemsPerPage, 10) - parseInt(itemsPerPage, 10),
          currentPage * parseInt(itemsPerPage, 10),
        )
        .map(item => {
          const {
            address: {
              formattedAddress,
              geolocation: {lat, lng},
            },
            bathrooms,
            bedrooms,
            price,
            id,
          } = item;
          return (
            <Card
              key={id}
              title={formattedAddress}
              subtitle={`${lat} : ${lng}`}
              content={
                <View>
                  <Row>
                    <CardTextItem>{bathrooms} bathroom(s)</CardTextItem>
                    <CardTextItem>{bedrooms} bedroom(s)</CardTextItem>
                  </Row>
                  <CardTextPrice>{priceMask(price)}</CardTextPrice>
                </View>
              }
              buttons={[
                {
                  title: 'All details',
                  onPress: () => handleSeeFullDetails(item),
                },
              ]}
            />
          );
        })}
    </ScrollView>
  );
};

export default HousingListScreen;
