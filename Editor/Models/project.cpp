/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "project.h"
#include "rpm.h"
#include "projectupdater.h"
#include "dialogprogress.h"
#include "common.h"
#include <QDirIterator>
#include <QMessageBox>
#include <QApplication>
#include <QThread>

const QString Project::ENGINE_VERSION = "1.5.0";
const QString Project::LAST_BUILD_DATE = "April 11 2020";
const int Project::MAX_PROJECTS_NUMBER = 6;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Project::Project() :
    p_currentMap(nullptr),
    p_currentMapConfig(nullptr),
    m_currentParameters(nullptr),
    p_gameDatas(new GameDatas),
    m_treeMapDatas(new TreeMapDatas),
    m_langsDatas(new LangsDatas),
    m_scriptsDatas(new ScriptsDatas),
    m_picturesDatas(new PicturesDatas),
    m_videosDatas(new VideosDatas),
    m_songsDatas(new SongsDatas),
    m_shapesDatas(new ShapesDatas),
    m_keyBoardDatas(new KeyBoardDatas),
    m_specialElementsDatas(new SpecialElementsDatas)
{

}

Project::~Project()
{
    delete m_langsDatas;
    delete p_gameDatas;
    delete m_treeMapDatas;
    delete m_scriptsDatas;
    delete m_picturesDatas;
    delete m_videosDatas;
    delete m_songsDatas;
    delete m_shapesDatas;
    delete m_keyBoardDatas;
    delete m_specialElementsDatas;
}

// Gets

QString Project::pathCurrentProject() const{ return p_pathCurrentProject; }

void Project::setPathCurrentProject(QString s){ p_pathCurrentProject = s; }

Map* Project::currentMap(bool force) const {
    return RPM::isInConfig && !force ? p_currentMapConfig : p_currentMap;
}

void Project::setCurrentMap(Map* m) {
    if (RPM::isInConfig)
        p_currentMapConfig = m;
    else
        p_currentMap = m;
}

SystemCommonObject * Project::currentObject() const {
    return m_currentObject;
}

void Project::setCurrentObject(SystemCommonObject *object) {
    m_currentObject = object;
}

QStandardItemModel * Project::currentParameters() const {
    return m_currentParameters;
}

void Project::setCurrentParameters(QStandardItemModel *parameters) {
    m_currentParameters = parameters;
}

GameDatas* Project::gameDatas() const { return p_gameDatas; }

TreeMapDatas* Project::treeMapDatas() const { return m_treeMapDatas; }

LangsDatas* Project::langsDatas() const { return m_langsDatas; }

ScriptsDatas* Project::scriptsDatas() const { return m_scriptsDatas; }

PicturesDatas* Project::picturesDatas() const { return m_picturesDatas; }

VideosDatas * Project::videosDatas() const {
    return m_videosDatas;
}

SongsDatas* Project::songsDatas() const { return m_songsDatas; }

ShapesDatas* Project::shapesDatas() const { return m_shapesDatas; }

KeyBoardDatas* Project::keyBoardDatas() const { return m_keyBoardDatas; }

SpecialElementsDatas* Project::specialElementsDatas() const {
    return m_specialElementsDatas;
}

QString Project::version() const { return m_version; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel * Project::currentObjectProperties() const {
    return m_currentObject == nullptr ? nullptr : m_currentObject
        ->modelProperties();
}

void Project::setDefault(){
    m_langsDatas->setDefault();
    m_keyBoardDatas->setDefaultGame();
    m_picturesDatas->setDefault();
    m_videosDatas->setDefault();
    m_songsDatas->setDefault();
    m_shapesDatas->setDefault();
    p_gameDatas->setDefault();
    p_gameDatas->readAnimations(p_pathCurrentProject);
    p_gameDatas->animationsDatas()->setDefault();
    m_treeMapDatas->setDefault();
    m_scriptsDatas->setDefault();
    m_specialElementsDatas->setDefault();
}

// -------------------------------------------------------

void Project::saveCurrentMap(){
    p_currentMap->save();
    p_currentMap->setSaved(true);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

bool Project::read(QString path){
    setPathCurrentProject(path);

    if (!readVersion())
        return false;

    if (!readOS())
        return false;

    this->readAll();
    p_currentMap = nullptr;

    return true;
}

void Project::readAll() {
    this->readLangsDatas();
    this->readKeyBoardDatas();
    this->readPicturesDatas();
    this->readVideosDatas();
    this->readSongsDatas();
    this->readShapesDatas();
    this->readGameDatas();
    this->readTreeMapDatas();
    this->readScriptsDatas();
    this->readSpecialsDatas();
}

// -------------------------------------------------------

bool Project::readVersion(){

    QFile file(Common::pathCombine(p_pathCurrentProject, "game.rpm"));
    if(!file.open(QIODevice::ReadOnly)) {
        QMessageBox::information(nullptr, "error", file.errorString());
    }

    QTextStream in(&file);
    m_version = in.readLine();
    file.close();
    QString information = RPM::translate(Translations::VERSION_PB_1) + RPM::SPACE
        + m_version + RPM::SPACE + RPM::translate(Translations::VERSION_PB_2) +
        RPM::SPACE + Project::ENGINE_VERSION + RPM::DOT;

    int dBefore = Common::versionDifferent(m_version, "0.3.0");

    // If impossible to convert the version
    if (dBefore == -2) {
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR) + RPM
            ::COLON + RPM::SPACE + RPM::translate(Translations
            ::COULD_NOT_FIND_PROJECT_VERSION) + RPM::DOT, RPM::translate(
            Translations::IMPOSSIBLE_TO_CONVERT) + RPM::SPACE + m_version + RPM
            ::DOT);
        return false;
    }

    // If version < 0.3.0, tell that the project updater didn't existed yet
    if (dBefore == -1) {
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR) + RPM
            ::COLON + RPM::SPACE + RPM::translate(Translations
            ::IMPOSSIBLE_CONVERSION_1), information + RPM::SPACE + RPM
            ::translate(Translations::IMPOSSIBLE_CONVERSION_2) + RPM::DOT);
        return false;
    }

    int d = Common::versionDifferent(m_version, Project::ENGINE_VERSION);

    // If the project if superior to the engine
    if (d == 1) {
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR) + RPM
            ::COLON + RPM::SPACE + RPM::translate(Translations
            ::IMPOSSIBLE_CONVERSION_1), information + RPM::SPACE + RPM
            ::translate(Translations::IMPOSSIBLE_CONVERSION_3) + RPM::DOT);
        return false;
    }

    // If the project is inferior
    if (d == -1) {
        QDir dirProject(p_pathCurrentProject);
        QString previousFolderName = dirProject.dirName() +
                                     "-" + m_version;
        QMessageBox::StandardButton box = QMessageBox::question(nullptr, RPM
            ::translate(Translations::ERROR) + RPM::COLON + RPM::SPACE + RPM
            ::translate(Translations::CONVERSION_NEEDED), information + RPM
            ::SPACE + RPM::translate(Translations::CONVERT_PROJECT) + RPM::SPACE
            + previousFolderName + RPM::PARENTHESIS_RIGHT + RPM::DOT,
            QMessageBox::Yes | QMessageBox::No);
        if (box == QMessageBox::Yes) {
            DialogProgress dialog;
            QThread* thread = new QThread(qApp->parent());
            ProjectUpdater* worker = new ProjectUpdater(this,
                                                        previousFolderName);
            worker->moveToThread(thread);
            qApp->connect(worker, SIGNAL(finished()),
                          worker, SLOT(deleteLater()));
            qApp->connect(worker, SIGNAL(finished()),
                          &dialog, SLOT(accept()));
            qApp->connect(thread, SIGNAL(started()),
                          worker, SLOT(check()));
            qApp->connect(worker, SIGNAL(progress(int, QString)),
                          &dialog, SLOT(setValueLabel(int, QString)));
            thread->start();
            dialog.exec();

            return true;
        }

        return false;
    }

    return true;
}

// -------------------------------------------------------

bool Project::readOS() {
    OSKind projectOS = getProjectOS();
    OSKind computerOS = getComputerOS();
    int projectOSInteger = static_cast<int>(projectOS);
    int computerOSInteger = static_cast<int>(computerOS);

    // Compare
    if (computerOS != projectOS) {
        QString information = RPM::translate(Translations::INCOMPATIBLE_OS_1) +
            RPM::SPACE + RPM::ENUM_TO_STRING_OS_KIND.at(projectOSInteger) + RPM
            ::SPACE + RPM::translate(Translations::INCOMPATIBLE_OS_2) + RPM
            ::SPACE + RPM::ENUM_TO_STRING_OS_KIND.at(computerOSInteger) + RPM
            ::SPACE + RPM::translate(Translations::INCOMPATIBLE_OS_3) + RPM::DOT;
        QString question = RPM::translate(Translations::INCOMPATIBLE_OS_4) + RPM
            ::SPACE + RPM::ENUM_TO_STRING_OS_KIND.at(computerOSInteger) + RPM
            ::SPACE + RPM::translate(Translations::INCOMPATIBLE_OS_5) + RPM::DOT;
        QMessageBox::StandardButton box = QMessageBox::question(nullptr, RPM
            ::translate(Translations::ERROR) + RPM::COLON + RPM::SPACE + RPM
            ::translate(Translations::INCOMPATIBLE_OS), information + RPM
            ::NEW_LINE + question, QMessageBox::Yes | QMessageBox::No);
        if (box == QMessageBox::Yes) {
            removeOSFiles();
            copyOSFiles();
        }
        else
            return false;
    }

    return true;
}

// -------------------------------------------------------

OSKind Project::getProjectOS() {
    if (QFile(Common::pathCombine(p_pathCurrentProject,"Game.exe")).exists())
        return OSKind::Window;
    else if (QFile(Common::pathCombine(p_pathCurrentProject,"Game.sh")).exists())
        return OSKind::Linux;
    else
        return OSKind::Mac;
}

// -------------------------------------------------------

OSKind Project::getComputerOS() {
    #ifdef Q_OS_WIN
        return OSKind::Window;
    #elif __linux__
        return OSKind::Linux;
    #else
        return OSKind::Mac;
    #endif
}

// -------------------------------------------------------

bool Project::copyOSFiles() {
    QString pathContent = Common::pathCombine(QDir::currentPath(), "Content");

    // Copy excecutable and libraries according to current OS
    QString strOS = "";
    #ifdef Q_OS_WIN
        strOS = "win32";
    #elif __linux__
        strOS = "linux";
    #else
        strOS = "osx";
    #endif

    // Copying a basic project content
    return Common::copyPath(Common::pathCombine(pathContent, strOS),
                           p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::removeOSFiles() {
    QDirIterator directories(p_pathCurrentProject,
                             QDir::Dirs | QDir::NoDotAndDotDot);
    QDirIterator files(p_pathCurrentProject, QDir::Files);

    // Remove directories exept Content
    while (directories.hasNext()){
        directories.next();
        if (directories.fileName() != "Content")
            QDir(directories.filePath()).removeRecursively();
    }

    // Remove files exept game.rpm
    while (files.hasNext()){
        files.next();
        if (files.fileName() != "game.rpm")
            QFile(files.filePath()).remove();
    }
}

// -------------------------------------------------------

void Project::readGameDatas(){
    p_gameDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readLangsDatas(){
    m_langsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readTreeMapDatas(){
    m_treeMapDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readScriptsDatas(){
    m_scriptsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readKeyBoardDatas(){
    m_keyBoardDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readPicturesDatas(){
    m_picturesDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readVideosDatas() {
    m_videosDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readSongsDatas(){
    m_songsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readShapesDatas(){
    m_shapesDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readSpecialsDatas() {
    m_specialElementsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readSystemDatas(){
    p_gameDatas->readSystem(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readBattleSystemDatas() {
    p_gameDatas->readBattleSystem(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readTilesetsDatas() {
    p_gameDatas->readTilesets(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readCommonEvents() {
    p_gameDatas->readCommonEvents(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readTitleScreenGameOver() {
    p_gameDatas->readTitleScreenGameOver(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::write(QString path) {
    setPathCurrentProject(path);
    this->writeAll();
}

// -------------------------------------------------------

void Project::writeAll() {
    writeLangsDatas();
    writeKeyBoardDatas();
    writePicturesDatas();
    writeVideosDatas();
    writeSongsDatas();
    writeSpecialsDatas();
    writeGameDatas();
    writeShapesDatas();
    writeTreeMapDatas();
    writeScriptsDatas();
}

// -------------------------------------------------------

void Project::writeGameDatas(){
    p_gameDatas->write(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeLangsDatas(){
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_LANGS), *m_langsDatas);
}

// -------------------------------------------------------

void Project::writeTreeMapDatas(){
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_TREE_MAP), *m_treeMapDatas);
}

// -------------------------------------------------------

void Project::writeScriptsDatas(){
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_SCRIPTS), *m_scriptsDatas);
}

// -------------------------------------------------------

void Project::writeKeyBoardDatas(){
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_KEYBOARD), *m_keyBoardDatas);
}

// -------------------------------------------------------

void Project::writePicturesDatas(){
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_PICTURES_DATAS), *m_picturesDatas);
}

// -------------------------------------------------------

void Project::writeVideosDatas() {
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_VIDEOS_DATAS), *m_videosDatas);
}

// -------------------------------------------------------

void Project::writeSongsDatas() {
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_SONGS_DATAS), *m_songsDatas);
}

// -------------------------------------------------------

void Project::writeShapesDatas() {
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_SHAPES_DATAS), *m_shapesDatas);
}

// -------------------------------------------------------

void Project::writeSpecialsDatas() {
    RPM::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_SPECIAL_ELEMENTS),
                     *m_specialElementsDatas);
}

// -------------------------------------------------------

void Project::writeSystemDatas(){
    p_gameDatas->writeSystem(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeBattleSystemDatas() {
    p_gameDatas->writeBattleSystem(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeTilesetsDatas() {
    p_gameDatas->writeTilesets(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeCommonEvents() {
    p_gameDatas->writeCommonEvents(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeTitleScreenGameOver() {
    p_gameDatas->writeTitleScreenGameOver(p_pathCurrentProject);
}

// -------------------------------------------------------

QString Project::createRPMFile() {
    QFile file(Common::pathCombine(p_pathCurrentProject, "game.rpm"));
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text))
        return RPM::translate(Translations::ERROR_WHILE_CREATING_RPM_FILE) + RPM
            ::DOT;
    QTextStream out(&file);
    out << Project::ENGINE_VERSION;

    return NULL;
}

// -------------------------------------------------------

bool Project::isHeroDefined() const {
    return p_gameDatas->systemDatas()->idMapHero() != -1;
}
