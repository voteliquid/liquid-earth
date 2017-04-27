const closeIntroScript = "document.querySelector('earth-app').shadowRoot.querySelector('earth-balloon /deep/ paper-material paper-icon-button').click(); return true;"

const openPanel = "document.querySelector('earth-app').shadowRoot.querySelector('paper-drawer-panel div earth-toolbar').shadowRoot.querySelector('paper-material paper-icon-button#search').click();"

const selectInput = "document.querySelector('earth-app').shadowRoot.querySelector('paper-drawer-panel div earth-drawer').shadowRoot.querySelector('neon-animated-pages earth-search').shadowRoot.querySelector('paper-header-panel div earth-omnibox').shadowRoot.querySelector('paper-material div paper-input-container input')"

const toggleAll = "document.querySelectorAll('earth-app /deep/ paper-drawer-panel#drawerPanel div.layout.horizontal earth-drawer#drawerContainer /deep/ neon-animated-pages#pages earth-base-layer-styles /deep/ app-header-layout div#baseLayerStyles earth-base-layer-styles-item /deep/ div#baseLayerStylesItem earth-toggle-icon-button')[2].click()"

const fly = "document.querySelector('earth-app /deep/ paper-drawer-panel div earth-knowledge-card#knowledgeCard /deep/ neon-animated-pages#pages neon-animatable#cardStack earth-normal-card#topCard /deep/ paper-card#card paper-fab#fly').click()"

const topResult = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#resultsPanel div#organicResults iron-selector earth-search-result-item')"

const clickTopResult = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#resultsPanel div#organicResults iron-selector earth-search-result-item').click()"

const hideSearch = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#toolbar paper-icon-button#hideButton').click()"

const clearSearch = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#toolbar earth-omnibox#omnibox /deep/ paper-material#searchBox div#searchInput paper-input-container#query div#buttonDiv paper-icon-button#clearIcon').click()"

const toggleDimension = "document.querySelector('earth-app /deep/ paper-drawer-panel div div#earthRelativeElements div#earthNavigationElements earth-hover-button#hoverButton').click()"


module.exports = {
  closeIntroScript,
  openPanel,
selectInput, 
toggleAll, 
fly,
topResult, 
clickTopResult, 
hideSearch, 
clearSearch, 
toggleDimension 
}
