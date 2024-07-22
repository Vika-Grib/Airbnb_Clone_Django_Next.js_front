'use client';
import { useEffect, useState } from 'react';
import PropertyListItem from "./PropertyListItem";
import apiService from '@/app/services/apiService';

export type PropertyType = {
    id: string;
    title: string;
    price_per_night: number;
    image_url: string;
    is_favorite: boolean;
}

interface PropertyListProps {
    landlord_id?: string | null;
    favorites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites
}) => {
    const [properties, setProperties] = useState<PropertyType[]>([]);


    const markFavorite = (id: string, is_favorite: boolean) => {
    // Создаем новый массив свойств, применяя map к текущему массиву properties
        const tmpProperties = properties.map((property: PropertyType) => {
        // Проверяем, совпадает ли ID текущего свойства с переданным ID
            if (property.id == id) {
            // Обновляем статус "избранного" для данного свойства
                property.is_favorite = is_favorite

                if (is_favorite) {
                    console.log('added to list of favorited propreties')
                } else {
                    console.log('removed from list')
                }
            }

            return property;
        })
        // Обновленное свойство возвращается и включается в новый массив tmpProperties
        setProperties(tmpProperties);
    }

    const getProperties = async () => {
        let url = '/api/properties/';

        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`
        } else if (favorites) {
            url += '?is_favorites=true'
        }

        const tmpProperties = await apiService.get(url)

        setProperties(tmpProperties.data.map((property: PropertyType) => {
            if (tmpProperties.favorites.includes(property.id)) {
                property.is_favorite = true
            } else {
                property.is_favorite = false
            }

            return property
        }));
    };

    useEffect(() => {
        getProperties();
    }, []);

    return (
        <>
            {properties.map((property) => {
                return (
                    <PropertyListItem
                        key={property.id}
                        property={property}
                        markFavorite={(is_favorite: any) => markFavorite(property.id, is_favorite)}
                    />
                )
            })}
        </>
    )
}

export default PropertyList;