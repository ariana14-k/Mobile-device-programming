import {Text, View} from 'react-native'
import {Link} from 'expo-router'

export default function NotFound() {
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Page not found!</Text>
            <Link href='/'>Go back to Home</Link>
        </View>
    )
}