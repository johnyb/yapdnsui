
type ICodeceptCallback = (i: CodeceptJS.I) => void;

declare const actor: () => CodeceptJS.I;
declare const Feature: (string: string) => void;
declare const Scenario: (string: string, callback: ICodeceptCallback) => void;
declare const Before: (callback: ICodeceptCallback) => void;
declare const BeforeSuite: (callback: ICodeceptCallback) => void;
declare const After: (callback: ICodeceptCallback) => void;
declare const AfterSuite: (callback: ICodeceptCallback) => void;
declare const within: (selector: string, callback: Function) => void;

declare namespace CodeceptJS {
  export interface I {
    amAcceptingPopups: () => any; 
    acceptPopup: () => any; 
    amCancellingPopups: () => any; 
    cancelPopup: () => any; 
    seeInPopup: (seeInPopup(text) => any; 
    grabPopupText: (grabPopupText() => any; 
    amOnPage: (amOnPage(url) => any; 
    resizeWindow: (resizeWindow(width, height) => any; 
    haveRequestHeaders: (haveRequestHeaders(customHeaders) => any; 
    moveCursorTo: (moveCursorTo(locator, offsetX=0, offsetY=0) => any; 
    dragAndDrop: (dragAndDrop(source, destination) => any; 
    refreshPage: (refreshPage() => any; 
    scrollPageToTop: (scrollPageToTop) => any; 
    scrollPageToBottom: (scrollPageToBottom) => any; 
    scrollTo: (async) => any; 
    seeInTitle: (seeInTitle(text) => any; 
    grabPageScrollPosition: (grabPageScrollPosition() => any; 
    seeTitleEquals: (seeTitleEquals(text) => any; 
    dontSeeInTitle: (dontSeeInTitle(text) => any; 
    grabTitle: (grabTitle() => any; 
    switchToNextTab: (switchToNextTab(num=1) => any; 
    switchToPreviousTab: (switchToPreviousTab(num=1) => any; 
    closeCurrentTab: (closeCurrentTab() => any; 
    closeOtherTabs: (async) => any; 
    openNewTab: (openNewTab() => any; 
    grabNumberOfOpenTabs: (grabNumberOfOpenTabs() => any; 
    seeElement: (async) => any; 
    dontSeeElement: (async) => any; 
    seeElementInDOM: (async) => any; 
    dontSeeElementInDOM: (async) => any; 
    click: (click(locator, context=null) => any; 
    doubleClick: (doubleClick(locator, context=null) => any; 
    rightClick: (rightClick(locator, context=null) => any; 
    checkOption: (checkOption(field, context=null) => any; 
    seeCheckboxIsChecked: (seeCheckboxIsChecked(field) => any; 
    dontSeeCheckboxIsChecked: (dontSeeCheckboxIsChecked(field) => any; 
    pressKey: (pressKey(key) => any; 
    fillField: (async) => any; 
    clearField: (clearField(field) => any; 
    appendField: (appendField(field, value) => any; 
    seeInField: (seeInField(field, value) => any; 
    dontSeeInField: (dontSeeInField(field, value) => any; 
    attachFile: (attachFile(locator, pathToFile) => any; 
    selectOption: (async) => any; 
    grabNumberOfVisibleElements: (async) => any; 
    seeInCurrentUrl: (seeInCurrentUrl(url) => any; 
    dontSeeInCurrentUrl: (dontSeeInCurrentUrl(url) => any; 
    seeCurrentUrlEquals: (seeCurrentUrlEquals(url) => any; 
    dontSeeCurrentUrlEquals: (dontSeeCurrentUrlEquals(url) => any; 
    see: (see(text, context=null) => any; 
    seeTextEquals: (seeTextEquals(text, context=null) => any; 
    dontSee: (dontSee(text, context=null) => any; 
    grabSource: (grabSource() => any; 
    grabBrowserLogs: (grabBrowserLogs() => any; 
    grabCurrentUrl: (grabCurrentUrl() => any; 
    seeInSource: (seeInSource(text) => any; 
    dontSeeInSource: (dontSeeInSource(text) => any; 
    seeNumberOfElements: (seeNumberOfElements(selector, num) => any; 
    seeNumberOfVisibleElements: (seeNumberOfVisibleElements(locator, num) => any; 
    setCookie: (setCookie(cookie) => any; 
    seeCookie: (async) => any; 
    dontSeeCookie: (async) => any; 
    grabCookie: (async) => any; 
    clearCookie: (async) => any; 
    executeScript: (executeScript(fn) => any; 
    executeAsyncScript: (async) => any; 
    grabTextFrom: (async) => any; 
    grabValueFrom: (async) => any; 
    grabHTMLFrom: (async) => any; 
    grabCssPropertyFrom: (async) => any; 
    seeCssPropertiesOnElements: (async) => any; 
    seeAttributesOnElements: (async) => any; 
    grabAttributeFrom: (async) => any; 
    saveScreenshot: (saveScreenshot(fileName, fullPage) => any; 
    wait: (async) => any; 
    waitForEnabled: (async) => any; 
    waitForValue: (async) => any; 
    waitNumberOfVisibleElements: (async) => any; 
    waitForElement: (async) => any; 
    waitForVisible: (async) => any; 
    waitForInvisible: (async) => any; 
    waitToHide: (async) => any; 
    waitInUrl: (async) => any; 
    waitUrlEquals: (async) => any; 
    waitForText: (async) => any; 
    switchTo: (async) => any; 
    waitUntil: (waitUntil(fn, sec=null) => any; 
    waitUntilExists: (waitUntilExists(locator, sec) => any; 
    waitForDetached: (async) => any; 
    debug: (msg) => any; 
    debugSection: (section, msg) => any; 
    say: (msg) => any; 
    retry: (function) => any; 

  }
}

declare module "codeceptjs" {
    export = CodeceptJS;
}