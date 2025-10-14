import {Text, View} from 'react-native'
import {useLocalSearchParams} from 'expo-router'

export default function TaskDetails() {
    const {id} = useLocalSearchParams()
    return (
        <View>
            <Text>Item ID: {id}</Text>
        </View>
    )
}