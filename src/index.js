import axios from 'axios'
import url from './api/http'
console.log('我是index页面')
import $ from 'jquery'
$('body').css('background', 'pink')
console.log('index', $)
console.log('index', window.$)

axios.get(url)
