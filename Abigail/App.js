import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ListView,
  Image
} from 'react-native';
// import jq from "https://code.jquery.com/jquery-2.2.4.js"
// import * as resObject from "./test.json"

const items = ["Bob", "Sally", "Gil", "Babak", "Rachna", "Tiffany", "Jared", "Sophia", "Jeremy", "Jordan", "Jon Jay", "Sameer"]
const patientUrl = "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=4342009"
const sandboxUrl = "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/"
const patientID = 4342009

const capitalize = (string) => {
  newString = string.toLowerCase()
  newString = newString.charAt(0).toUpperCase() + newString.slice(1)
  return newString
}

export default class App extends React.Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      dataSource: ds.cloneWithRows([]),
      residentName: "Loading..."
    }
  }

  componentDidMount() {
    //Getting The patient ID
    fetch(patientUrl,
      {
        method: "GET",
        mode: "cors",
        headers: { "Accept": "application/json", }

      }).then((resObject) => {
        resObject.json().then(resJson => {
          let firstName = resJson.entry[0].resource.name[0].given.toString()
          let lastName = resJson.entry[0].resource.name[0].family.toString()


          firstName = capitalize(firstName)
          lastName = capitalize(lastName)
          this.setState({ residentName: firstName + " " + lastName })

        })
      })

    //Getting the encounters
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    fetch(sandboxUrl + "Encounter?patient=" + patientID,
    {
      method: "GET",
      mode: "cors",
      headers: { "Accept": "application/json", }

    }).then((resObject) => {
      resObject.json().then(resJson => {
        this.setState({
          dataSource: ds.cloneWithRows(resJson.entry)
        })
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Image
            style={styles.profilePic}
            resizeMode="cover"
            source={require("./happy_lady.jpg")}
          />
          <Text style={styles.profileName}>{this.state.residentName}</Text>
        </View>
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => {
            return (
              <EventItem Data={rowData} sectionID={sectionID} rowID={rowID} />
            )
          }
          }
        />
      </View>
    );
  }
}

class EventItem extends React.Component {
  constructor(props){
    super(props)
    this.state={
      iconSRC:{},
      text:"",
      timestamp:"",
    }
  }
  determineText(data){
    switch(data.resourceType){
      case "Encounter":
        return "Had a " + data.type[0].text + " vist at " + data.location[0].location.display + ". Reason: " + data.reason[0].text 
      break;
    }
  }

  componentDidMount(){
    const randNum = Math.floor(Math.random()*500 + 100)
    randomCat={uri:"https://placekitten.com/" + randNum + "/" + randNum}
    newText = this.determineText(this.props.Data.resource)
    this.setState({
      text : newText,
      iconSRC : randomCat,
    })
  }

  

  render() {
    return (
      <View style={styles.eventItem}>
      <Image source={this.state.iconSRC} style={styles.eventIcon} />
        <Text style={styles.eventText}>{this.state.text}</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    flex: 0.5,
    height: 200,
    width: 500,
    backgroundColor: 'lightblue',
    borderWidth: 2,
    borderRadius: 0,
    alignItems: 'center'

  },
  eventItem: {
    alignItems: 'center',
    padding: 8,
    width: 320,
    borderBottomWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
  },
  eventIcon:{
    width:50,
    height:50,
  },
  eventText: {
    flex: 1,
    fontSize: 15,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: 'steelblue',
    borderWidth: 5,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 30
  }
});
