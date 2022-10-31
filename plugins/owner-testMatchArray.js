let arr1 = ['A', 'B', 'C', 'D', 'E']
let arr2 = ['A', 'B', 'C', 'D', 'E']
let arr3 = ['A', 'B', 'C', 'D', 'E']
let arr4 = ['A', 'B', 'C', 'D', 'E']
let arr5 = ['A', 'B', 'C', 'D', 'E']

async function matchArray(arr1, arr2, arr3, arr4, arr5){
    let res = []
    let newArray = ''
	for(let a = 0; a < arr1.length; a++){
        for(let b = 0; b < arr2.length; b++){
        	if(arr1[a] === arr2[b]) continue
            for(let c = 0; c < arr3.length; c++){
            	if(arr1[a] === arr2[b] || arr1[a] === arr3[c] || arr2[b] === arr3[c]) continue
                for(let d = 0; d < arr4.length; d++){
                	if(arr1[a] === arr2[b] || arr1[a] === arr3[c] || arr2[b] === arr3[c] || arr1[a] === arr4[d] || arr2[b] === arr4[d] || arr3[c] === arr4[d]) continue
                    for(let e = 0; e < arr5.length; e++){
                    	if(arr1[a] === arr2[b] || arr1[a] === arr3[c] || arr2[b] === arr3[c] || arr1[a] === arr4[d] || arr2[b] === arr4[d] || arr3[c] === arr4[d] || arr1[a] === arr5[e] || arr2[b] === arr5[e] || arr3[c] === arr5[e] || arr4[d] === arr5[e]) continue
                        newArray = [...`${arr1[a]}${arr2[b]}${arr3[c]}${arr4[d]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = newArray = [...`${arr1[a]}${arr2[b]}${arr3[c]}${arr4[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr2[b]}${arr3[c]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr2[b]}${arr4[d]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr3[c]}${arr4[d]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr2[b]}${arr3[c]}${arr4[d]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr2[b]}${arr3[c]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr1[a]}${arr2[b]}${arr4[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr3[c]}${arr4[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr2[b]}${arr3[c]}${arr4[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr1[a]}${arr2[b]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr3[c]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr2[b]}${arr3[c]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr3[c]}${arr4[d]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr2[b]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr1[a]}${arr3[c]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr1[a]}${arr4[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr1[a]}${arr5[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr2[b]}${arr3[c]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr2[b]}${arr3[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)
                        newArray = [...`${arr2[b]}${arr3[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray)  
                        newArray = [...`${arr2[c]}${arr3[d]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr2[c]}${arr3[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                        newArray = [...`${arr2[d]}${arr3[e]}`].sort().toString().replace(/,/g, '')
                        if(!res.find(array => array === newArray)) res.push(newArray) 
                    }
                }
            }
        }
    }
    return res
}
 
let handler = async (m, { args, conn, text, usedPrefix }) => {
    let arra = await matchArray(arr1, arr2, arr3, arr4, arr5)
    m.reply(`Total: ${arra.length}
List:
${arra.sort().join('\n')}`) 
}

handler.help = ['tma']
handler.tags = ['owner']
handler.rowner = true
handler.command = /^tma$/i

module.exports = handler
