function xml2yaml(featureXML, featureYAML) {
  
}

function yaml2xml(featureYAML, xmlVersion) {
  const featureXML = {
    declaration: {
      attributes: {
        version: '1.0',
        encoding: 'UTF-8',
      }
    },
    elements: [
      {
        type: 'element',
        name: 'Package',
        attributes: {
          xmlns: 'http://soap.sforce.com/2006/04/metadata'
        },
        elements: [],
      },
    ],
  }

  for (let metadataType in featureYAML) {
    if (metadataType === 'ManualSteps' || metadataType === 'Version') continue
    let typesElement = {
      type: 'element',
      name: 'types',
      elements: [],
    }
    if (featureYAML[metadataType] && featureYAML[metadataType].length > 0) {
      for (let metadataName of featureYAML[metadataType]) {
        typesElement.elements.push({
          type: 'element',
          name: 'members',
          elements: [
            {
              type: 'text',
              text: metadataName,
            },
          ],
        })
      }
      typesElement.elements.push({
        type: 'element',
        name: 'name',
        elements: [
          {
            type: 'text',
            text: metadataType,
          },
        ],
      })
    } else {
      typesElement.elements.push({
        type: 'element',
        name: 'members',
        elements: [
          {
            type: 'text',
            text: '*',
          },
        ],
      })
      typesElement.elements.push({
        type: 'element',
        name: 'name',
        elements: [
          {
            type: 'text',
            text: metadataType,
          },
        ],
      })
    }
    featureXML.elements[0].elements.push(typesElement)
  }
  featureXML.elements[0].elements.push({
    type: 'element',
    name: 'version',
    elements: [
      {
        type: 'text',
        text: xmlVersion,
      },
    ],
  })
  return featureXML
}

module.exports = {yaml2xml}
