import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Text, useWindowDimensions } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import firestore from '@react-native-firebase/firestore';
import QuestionScreen from './QuestionScreen';
import Modals from '../components/Modals';

const Test = ({ link }) => {
    const ref = useRef();
    const { width, height } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;

    const [data, setData] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [previousIndex, setPreviousIndex] = useState(0)
    const [isRedo, setIsRedo] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])  
    
    const fetchData = async ()=>{
       const documentId = link.split('data=')[1];
       const data = await firestore().collection('users').doc(documentId).get();
       setData(data.data())
    }

    console.log(currentIndex + 1)

    if (data && data.questions) {
        return (
            <>
                <SwiperFlatList
                    ref={ref}
                    data={data.questions}
                    renderItem={({ item }) => <QuestionScreen item={item} />}
                    centerContent
                    // scrollEnabled={false}
                    onChangeIndex={({ prevIndex, index }) => {
                        // On Next
                        if (index > currentIndex) {

                        }

                        // On Prev
                        if (prevIndex > previousIndex) {
                            setModalVisible(true);
                        }
                        setCurrentIndex(index)
                        setPreviousIndex(prevIndex)
                    }}
                    style={{ height, width }}
                    snapToAlignment={'end'}
                />

                <Modals modalVisible={modalVisible} setModalVisible={setModalVisible} errorHead={'Redo Question ?'} errorDesc={'Are you sure you want to redo this question'} />
            </>
        )
    }

    return (
        <Text>No Questions Found</Text>
    );
}

export default Test

// if (loading) {
//     return <View style={{width,height, justifyContent: 'center', alignItems: 'center' }}>
//       <ActivityIndicator size={'large'} />
//     </View>
//   }