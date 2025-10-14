import {useLocalSearchParams} from 'expo-router'
import {View, Text} from 'react-native'

export default function TaskDetails() {
    const {id} = useLocalSearchParams();
    return (
        <View>
            <Text>ID: {id}</Text>
        </View>
    )
}