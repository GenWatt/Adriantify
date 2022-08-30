import Song from '../assets/music/stomping-rock-four-shots-111444.mp3'
import Song2 from '../assets/music/loneliness-of-the-winner-110416.mp3'
import Song3 from '../assets/music/order-99518.mp3'
import Image from '../assets/song.jpeg'
import Image1 from '../assets/song2.jpg'
import Image2 from '../assets/song3.jpg'

const Songs = [
  {
    title: 'Stomping rock four shots',
    creator: 'AlexGrohl',
    song: Song,
    release: '20.04.2022',
    album: 'The album',
    image: Image,
    id: 0,
    duration: 119,
  },
  {
    title: 'Lonliness of the winner',
    creator: 'AmarantaMusic',
    song: Song2,
    release: '02.02.2019',
    album: 'New devide',
    image: Image1,
    id: 1,
    duration: 132,
  },
  {
    title: 'Order',
    creator: 'ComaStudio',
    song: Song3,
    image: Image2,
    release: '10.12.2019',
    album: 'unknown',
    id: 2,
    duration: 104,
  },
]

export default Songs
