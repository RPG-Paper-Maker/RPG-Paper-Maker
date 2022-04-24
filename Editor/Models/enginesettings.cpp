/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "enginesettings.h"
#include "rpm.h"
#include "common.h"
#include <QDir>
#include <QApplication>
#include <QStyleFactory>

const QString EngineSettings::JSON_KEYBOARD = "kb";
const QString EngineSettings::JSON_ZOOM_PICTURES = "zp";
const QString EngineSettings::JSON_THEME = "theme";
const QString EngineSettings::JSON_PROJECT_NAMES = "pn";
const QString EngineSettings::JSON_PROJECT_LINKS = "pl";
const QString EngineSettings::JSON_FIRST_TIME = "ft";
const QString EngineSettings::JSON_ROTATION_OPERATIONS = "ro";
const QString EngineSettings::JSON_ROTATION_LEFT_RIGHT_CLICK = "rlrc";
const QString EngineSettings::JSON_ROTATION_ANGLES = "ra";
const QString EngineSettings::JSON_TRANSLATION_OPERATIONS = "translationOperations";
const QString EngineSettings::JSON_TRANSLATION_LEFT_RIGHT_CLICK = "translationLeftRightClick";
const QString EngineSettings::JSON_TRANSLATION_BY_SQUARE = "translationBySquare";
const QString EngineSettings::JSON_TRANSLATION_VALUES = "translationValues";
const QString EngineSettings::JSON_UPDATER = "updater";
const QString EngineSettings::JSON_SHOW_AVAILABLE_CONTENT = "sac";
const QString EngineSettings::JSON_FIRST_TIME_LANGUAGES = "ftl";
const QString EngineSettings::JSON_CURRENT_LANGUAGE = "cl";
const QString EngineSettings::JSON_BATTLE_TROOP_TEST_BATTLE_MAP_ID = "battleTroopTestBattleMapID";
const QString EngineSettings::JSON_BATTLE_TROOP_TEST_HEROES = "battleTroopTestHeroes";
const QString EngineSettings::JSON_TAB_INDEX_DATAS = "tabIndexDatas";
const QString EngineSettings::JSON_TAB_INDEX_SYSTEMS = "tabIndexSystems";
const QString EngineSettings::THEME_DEFAULT = "defaulttheme";
const QString EngineSettings::THEME_WHITE = "whitetheme";
const QString EngineSettings::THEME_WHITE_MAC ="whitemactheme";
const QString EngineSettings::THEME_DARK = "darktheme";
const QString EngineSettings::JSON_PATREON_MESSAGE = "patreonMessage";
const QString EngineSettings::JSON_GUIDE_STEP_PICTURES = "guideStepPictures";
const QString EngineSettings::PATH_THEMES = ":/stylesheets/Themes/";
const bool EngineSettings::DEFAULT_FIRST_TIME_LANGUAGES = true;
const QString EngineSettings::DEFAULT_CURRENT_LANGUAGE = "en";
const int EngineSettings::DEFAULT_BATTLE_TROOP_TEST_BATTLE_MAP_ID = 1;
const int EngineSettings::DEFAULT_TAB_INDEX_DATAS = 0;
const int EngineSettings::DEFAULT_TAB_INDEX_SYSTEMS = 0;
const bool EngineSettings::DEFAULT_PATREON_MESSAGE = true;
const int EngineSettings::DEFAULT_GUIDE_STEP_PICTURES = 0;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

EngineSettings::EngineSettings() :
    m_keyBoardDatas(new KeyBoardDatas),
    m_zoomPictures(0),
    m_theme(ThemeKind::Dark),
    m_firstTime(true),
    m_updater(true),
    m_showAvailableContent(true),
    m_firstTimeLanguages(DEFAULT_FIRST_TIME_LANGUAGES),
    m_currentLanguage(DEFAULT_CURRENT_LANGUAGE),
    m_battleTroopTestBattleMapID(DEFAULT_BATTLE_TROOP_TEST_BATTLE_MAP_ID),
    m_tabIndexDatas(DEFAULT_TAB_INDEX_DATAS),
    m_tabIndexSystems(DEFAULT_TAB_INDEX_SYSTEMS),
    m_patreonMessage(DEFAULT_PATREON_MESSAGE),
    m_guideStepPictures(DEFAULT_GUIDE_STEP_PICTURES)
{
    // Default mac theme should be white
    #ifdef Q_OS_MAC
        m_theme = ThemeKind::White;
    #endif

    // Translation
    m_translationOperations.append(false);
    m_translationOperations.append(false);
    m_translationOperations.append(false);
    m_translationLeftRightClick = true;
    m_translationBySquare = true;
    m_translationValues.append(0);
    m_translationValues.append(0);
    m_translationValues.append(0);

    // Rotation
    m_rotationOperations.append(false);
    m_rotationOperations.append(false);
    m_rotationOperations.append(false);
    m_rotationLeftRightClick = true;
    m_rotationAngles.append(90);
    m_rotationAngles.append(90);
    m_rotationAngles.append(90);
}

EngineSettings::~EngineSettings() {
    delete m_keyBoardDatas;
}

KeyBoardDatas * EngineSettings::keyBoardDatas() const {
    return m_keyBoardDatas;
}

int EngineSettings::zoomPictures() const {
    return m_zoomPictures;
}

void EngineSettings::setZoomPictures(int z) {
    m_zoomPictures = z;
    write();
}

ThemeKind EngineSettings::theme() const {
    return m_theme;
}

void EngineSettings::setTheme(ThemeKind t) {
    m_theme = t;
}

int EngineSettings::projectNumber() const {
    return m_projectNames.length();
}

QString EngineSettings::projectAtName(int i) const {
    return m_projectNames.at(i);
}

QString EngineSettings::projectAtLink(int i) const {
    return m_projectLinks.at(i);
}

bool EngineSettings::firstTime() const {
    return m_firstTime;
}

void EngineSettings::setFirstTime(bool b) {
    m_firstTime = b;
}

bool EngineSettings::translationOperation(AxisKind ak) const
{
    return m_translationOperations.at(static_cast<int>(ak));
}

void EngineSettings::setTranslationOperation(AxisKind ak, bool b)
{
    m_translationOperations.replace(static_cast<int>(ak), b);
}

bool EngineSettings::translationLeftRightClick() const
{
    return m_translationLeftRightClick;
}

void EngineSettings::setTranslationLeftRightClick(bool b)
{
    m_translationLeftRightClick = b;
}

bool EngineSettings::translationBySquare() const
{
    return m_translationBySquare;
}

void EngineSettings::setTranslationBySquare(bool b)
{
    m_translationBySquare = b;
}

double EngineSettings::translationValue(AxisKind ak) const
{
    return m_translationValues.at(static_cast<int>(ak));
}

void EngineSettings::setTranslationValue(AxisKind ak, double a)
{
    m_translationValues.replace(static_cast<int>(ak), a);
}

bool EngineSettings::rotationOperation(AxisKind ak) const
{
    return m_rotationOperations.at(static_cast<int>(ak));
}

void EngineSettings::setRotationOperation(AxisKind ak, bool b)
{
    m_rotationOperations.replace(static_cast<int>(ak), b);
}

bool EngineSettings::rotationLeftRightClick() const
{
    return m_rotationLeftRightClick;
}

void EngineSettings::setRotationLeftRightClick(bool b)
{
    m_rotationLeftRightClick = b;
}

double EngineSettings::rotationAngle(AxisKind ak) const
{
    return m_rotationAngles.at(static_cast<int>(ak));
}

void EngineSettings::setRotationAngle(AxisKind ak, double a)
{
    m_rotationAngles.replace(static_cast<int>(ak), a);
}

bool EngineSettings::applyLeftRightClick(DrawKind drawKind) const
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        return m_translationLeftRightClick;
    case DrawKind::Rotate:
        return m_rotationLeftRightClick;
    default:
        return false;
    }
}

void EngineSettings::setApplyLeftRightClick(DrawKind drawKind, bool applyLeftRightClick)
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        m_translationLeftRightClick = applyLeftRightClick;
        break;
    case DrawKind::Rotate:
        m_rotationLeftRightClick = applyLeftRightClick;
        break;
    default:
        break;
    }
}

bool EngineSettings::bySquare(DrawKind drawKind) const
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        return m_translationBySquare;
    default:
        return false;
    }
}

void EngineSettings::setBySquare(DrawKind drawKind, bool bySquare)
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        m_translationBySquare = bySquare;
        break;
    default:
        break;
    }

}
bool EngineSettings::operation(DrawKind drawKind, AxisKind axisKind)
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        return this->translationOperation(axisKind);
    case DrawKind::Rotate:
        return this->rotationOperation(axisKind);
    default:
        return false;
    }
}

void EngineSettings::setOperation(DrawKind drawKind, AxisKind axisKind, bool b)
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        this->setTranslationOperation(axisKind, b);
        break;
    case DrawKind::Rotate:
        this->setRotationOperation(axisKind, b);
        break;
    default:
        break;
    }
}

double EngineSettings::value(DrawKind drawKind, AxisKind axisKind) const
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        return this->translationValue(axisKind);
    case DrawKind::Rotate:
        return this->rotationAngle(axisKind);
    default:
        return 0;
    }
}

void EngineSettings::setValue(DrawKind drawKind, AxisKind axisKind, double value)
{
    switch (drawKind)
    {
    case DrawKind::Translate:
        this->setTranslationValue(axisKind, value);
    case DrawKind::Rotate:
        this->setRotationAngle(axisKind, value);
        break;
    default:
        break;
    }
}

bool EngineSettings::updater() const {
    return m_updater;
}

void EngineSettings::setUpdater(bool u) {
    m_updater = u;
}

bool EngineSettings::showAvailableContent() const {
    return m_showAvailableContent;
}

void EngineSettings::setShowAvailableContent(bool sac) {
    m_showAvailableContent = sac;
}

bool EngineSettings::firstTimeLanguages() const
{
    return m_firstTimeLanguages;
}

void EngineSettings::setFirstTimeLanguages(bool ftl)
{
    m_firstTimeLanguages = ftl;
}

QString EngineSettings::currentLanguage() const
{
    return m_currentLanguage;
}
void EngineSettings::setCurrentLanguage(QString cl)
{
    m_currentLanguage = cl;
}

int EngineSettings::battleTroopTestBattleMapID() const
{
    return m_battleTroopTestBattleMapID;
}

void EngineSettings::setBattleTroopTestBattleMapID(int battleTroopTestBattleMapID)
{
    m_battleTroopTestBattleMapID = battleTroopTestBattleMapID;
}

QJsonArray EngineSettings::battleTroopTestHeroes() const
{
    return m_battleTroopTestHeroes;
}

void EngineSettings::setBattleTroopTestHeroes(QJsonArray &battleTroopTestHeros)
{
    m_battleTroopTestHeroes = battleTroopTestHeros;
}

int EngineSettings::tabIndexDatas() const
{
    return m_tabIndexDatas;
}

void EngineSettings::setTabIndexDatas(int tabIndexDatas)
{
    m_tabIndexDatas = tabIndexDatas;
}

int EngineSettings::tabIndexSystems() const
{
    return m_tabIndexSystems;
}

void EngineSettings::setTabIndexSystems(int tabIndexSystems)
{
    m_tabIndexSystems = tabIndexSystems;
}

bool EngineSettings::patreonMessage() const
{
    return m_patreonMessage;
}

void EngineSettings::setPatreonMessage(bool patreonMessage)
{
    m_patreonMessage = patreonMessage;
}

int EngineSettings::guideStepPictures() const
{
    return m_guideStepPictures;
}

void EngineSettings::setGuideStepPictures(int guideStepPictures)
{
    m_guideStepPictures = guideStepPictures;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void EngineSettings::setDefault() {
    m_keyBoardDatas->setDefaultEngine();
}

// -------------------------------------------------------

QString EngineSettings::getThemeContent() const {
    QString content;

    switch (m_theme) {
    case ThemeKind::Dark:
        content += this->readContent("darktheme");
        break;
    case ThemeKind::White:
        content += this->readContent("whitetheme");
        break;
    }

    return content;
}

// -------------------------------------------------------

void EngineSettings::read() {
    RPM::readJSON(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_ENGINE_SETTINGS), *this);
}

// -------------------------------------------------------

void EngineSettings::write() {
    RPM::writeJSON(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_ENGINE_SETTINGS), *this);
}

// -------------------------------------------------------

void EngineSettings::updateTheme() {
    QPalette darkPalette;

    switch (m_theme) {
    case ThemeKind::Dark:
        #ifdef Q_OS_WIN
            qApp->setStyleSheet(readContent(THEME_DEFAULT));
            qApp->setStyle(QStyleFactory::create("Fusion"));
            darkPalette.setColor(QPalette::Window, QColor(53,53,53));
            darkPalette.setColor(QPalette::WindowText, Qt::white);
            darkPalette.setColor(QPalette::Base, QColor(25,25,25));
            darkPalette.setColor(QPalette::AlternateBase, QColor(53,53,53));
            darkPalette.setColor(QPalette::ToolTipBase, Qt::white);
            darkPalette.setColor(QPalette::ToolTipText, Qt::white);
            darkPalette.setColor(QPalette::Text, Qt::white);
            darkPalette.setColor(QPalette::Button, QColor(53,53,53));
            darkPalette.setColor(QPalette::ButtonText, Qt::white);
            darkPalette.setColor(QPalette::BrightText, Qt::red);
            darkPalette.setColor(QPalette::Link, QColor(42, 130, 218));
            darkPalette.setColor(QPalette::Highlight, QColor(42, 130, 218));
            darkPalette.setColor(QPalette::HighlightedText, Qt::white);
            darkPalette.setColor(QPalette::Disabled, QPalette::Text, QColor(150,
                150,150));
            darkPalette.setColor(QPalette::Disabled, QPalette::WindowText,
                QColor(150,150,150));
            darkPalette.setColor(QPalette::Disabled, QPalette::ButtonText,
                QColor(150,150,150));
            qApp->setPalette(darkPalette);
        #else
            qApp->setStyleSheet(readContent(THEME_DARK));
        #endif
        break;
    case ThemeKind::White:
        #ifdef  Q_OS_MAC
            qApp->setStyleSheet(readContent(THEME_WHITE_MAC));
        #else
            qApp->setStyleSheet(readContent(THEME_WHITE));
        #endif
        break;
    }
}

// -------------------------------------------------------

void EngineSettings::updateProject(QString name, QString link) {
    m_projectNames.insert(0, name);
    m_projectLinks.insert(0, link);

    // Remove duplicates
    for (int i = m_projectLinks.size() - 1; i >= 0; i--)
    {
        for (int j = 0, l = m_projectLinks.size(); j < l && i != j; j++)
        {
            if (m_projectLinks.at(i) == m_projectLinks.at(j))
            {
                m_projectNames.removeAt(i);
                m_projectLinks.removeAt(i);
                break;
            }
        }
    }
    int nb = projectNumber();
    if (nb > Project::MAX_PROJECTS_NUMBER) {
        m_projectNames.removeAt(nb - 1);
        m_projectLinks.removeAt(nb - 1);
    }
    this->write();
}

// -------------------------------------------------------

void EngineSettings::clearProjects()
{
    m_projectLinks.clear();
    m_projectNames.clear();
}

// -------------------------------------------------------

QString EngineSettings::readContent(QString name) const {
    QFile file(PATH_THEMES + name + RPM::EXTENSION_QSS);
    if (file.open(QFile::ReadOnly)) {
       return QLatin1String(file.readAll());
    }
    return "";
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void EngineSettings::read(const QJsonObject &json) {
    QJsonArray tab;
    int i, l;

    m_keyBoardDatas->read(json[JSON_KEYBOARD].toObject());
    if (json.contains(JSON_ZOOM_PICTURES)) {
        m_zoomPictures = json[JSON_ZOOM_PICTURES].toInt();
    }
    m_theme = json.contains(JSON_THEME) ? static_cast<ThemeKind>(json[
        JSON_THEME].toInt()) : ThemeKind::Dark;
    tab = json[JSON_PROJECT_NAMES].toArray();
    m_projectNames.clear();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_projectNames << tab.at(i).toString();
    }
    tab = json[JSON_PROJECT_LINKS].toArray();
    m_projectLinks.clear();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_projectLinks << tab.at(i).toString();
    }
    if (json.contains(JSON_FIRST_TIME)) {
        m_firstTime = json[JSON_FIRST_TIME].toBool();
    }
    tab = json[JSON_TRANSLATION_OPERATIONS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_translationOperations.replace(i, tab.at(i).toBool());
    }
    m_translationLeftRightClick = json[JSON_TRANSLATION_LEFT_RIGHT_CLICK].toBool();
    m_translationBySquare = json[JSON_TRANSLATION_BY_SQUARE].toBool();
    tab = json[JSON_TRANSLATION_VALUES].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_translationValues.replace(i, tab.at(i).toDouble());
    }
    tab = json[JSON_ROTATION_OPERATIONS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_rotationOperations.replace(i, tab.at(i).toBool());
    }
    m_rotationLeftRightClick = json[JSON_ROTATION_LEFT_RIGHT_CLICK].toBool();
    tab = json[JSON_ROTATION_ANGLES].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_rotationAngles.replace(i, tab.at(i).toDouble());
    }
    if (json.contains(JSON_UPDATER)) {
        m_updater = json[JSON_UPDATER].toBool();
    }
    if (json.contains(JSON_SHOW_AVAILABLE_CONTENT)) {
        m_showAvailableContent = json[JSON_SHOW_AVAILABLE_CONTENT].toBool();
    }
    if (json.contains(JSON_FIRST_TIME_LANGUAGES))
    {
        m_firstTimeLanguages = json[JSON_FIRST_TIME_LANGUAGES].toBool();
    }
    if (json.contains(JSON_CURRENT_LANGUAGE))
    {
        m_currentLanguage = json[JSON_CURRENT_LANGUAGE].toString();
    }
    if (json.contains(JSON_BATTLE_TROOP_TEST_BATTLE_MAP_ID))
    {
        m_battleTroopTestBattleMapID = json[JSON_BATTLE_TROOP_TEST_BATTLE_MAP_ID].toInt();
    }
    m_battleTroopTestHeroes = json[JSON_BATTLE_TROOP_TEST_HEROES].toArray();
    if (json.contains(JSON_TAB_INDEX_DATAS))
    {
        m_tabIndexDatas = json[JSON_TAB_INDEX_DATAS].toInt();
    }
    if (json.contains(JSON_TAB_INDEX_SYSTEMS))
    {
        m_tabIndexSystems = json[JSON_TAB_INDEX_SYSTEMS].toInt();
    }
    if (json.contains(JSON_PATREON_MESSAGE))
    {
        m_patreonMessage = json[JSON_PATREON_MESSAGE].toBool();
    }
    if (json.contains(JSON_GUIDE_STEP_PICTURES))
    {
        m_guideStepPictures = json[JSON_GUIDE_STEP_PICTURES].toInt();
    }
}

// -------------------------------------------------------

void EngineSettings::write(QJsonObject &json) const {
    QJsonObject obj;
    QJsonArray tab;
    int i, l;

    m_keyBoardDatas->write(obj);
    json[JSON_KEYBOARD] = obj;
    json[JSON_ZOOM_PICTURES] = m_zoomPictures;
    if (m_theme != ThemeKind::Dark) {
        json[JSON_THEME] = static_cast<int>(m_theme);
    }
    for (i = 0, l = m_projectNames.size(); i < l; i++) {
        tab << m_projectNames.at(i);
    }
    json[JSON_PROJECT_NAMES] = tab;
    tab = QJsonArray();
    for (i = 0, l = m_projectLinks.size(); i < l; i++) {
        tab.append(m_projectLinks.at(i));
    }
    json[JSON_PROJECT_LINKS] = tab;
    if (!m_firstTime) {
        json[JSON_FIRST_TIME] = false;
    }
    tab = QJsonArray();
    for (i = 0, l = m_translationOperations.size(); i < l; i++)
    {
        tab.append(m_translationOperations.at(i));
    }
    json[JSON_TRANSLATION_OPERATIONS] = tab;
    json[JSON_TRANSLATION_LEFT_RIGHT_CLICK] = m_translationLeftRightClick;
    json[JSON_TRANSLATION_BY_SQUARE] = m_translationBySquare;
    tab = QJsonArray();
    for (i = 0, l = m_translationValues.size(); i < l; i++)
    {
        tab.append(m_translationValues.at(i));
    }
    json[JSON_TRANSLATION_VALUES] = tab;
    tab = QJsonArray();
    for (i = 0, l = m_rotationOperations.size(); i < l; i++)
    {
        tab.append(m_rotationOperations.at(i));
    }
    json[JSON_ROTATION_OPERATIONS] = tab;
    json[JSON_ROTATION_LEFT_RIGHT_CLICK] = m_rotationLeftRightClick;
    tab = QJsonArray();
    for (i = 0, l = m_rotationAngles.size(); i < l; i++)
    {
        tab.append(m_rotationAngles.at(i));
    }
    json[JSON_ROTATION_ANGLES] = tab;
    if (!m_updater) {
        json[JSON_UPDATER] = m_updater;
    }
    if (!m_showAvailableContent) {
        json[JSON_SHOW_AVAILABLE_CONTENT] = m_showAvailableContent;
    }
    if (m_firstTimeLanguages != DEFAULT_FIRST_TIME_LANGUAGES)
    {
        json[JSON_FIRST_TIME_LANGUAGES] = m_firstTimeLanguages;
    }
    if (m_currentLanguage != DEFAULT_CURRENT_LANGUAGE)
    {
        json[JSON_CURRENT_LANGUAGE] = m_currentLanguage;
    }
    if (m_battleTroopTestBattleMapID != DEFAULT_BATTLE_TROOP_TEST_BATTLE_MAP_ID)
    {
        json[JSON_BATTLE_TROOP_TEST_BATTLE_MAP_ID] = m_battleTroopTestBattleMapID;
    }
    json[JSON_BATTLE_TROOP_TEST_HEROES] = m_battleTroopTestHeroes;
    if (m_tabIndexDatas != DEFAULT_TAB_INDEX_DATAS)
    {
        json[JSON_TAB_INDEX_DATAS] = m_tabIndexDatas;
    }
    if (m_tabIndexSystems != DEFAULT_TAB_INDEX_SYSTEMS)
    {
        json[JSON_TAB_INDEX_SYSTEMS] = m_tabIndexSystems;
    }
    if (m_patreonMessage != DEFAULT_PATREON_MESSAGE)
    {
        json[JSON_PATREON_MESSAGE] = m_patreonMessage;
    }
    if (m_guideStepPictures != DEFAULT_GUIDE_STEP_PICTURES)
    {
        json[JSON_GUIDE_STEP_PICTURES] = m_guideStepPictures;
    }
}
