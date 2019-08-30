/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

const QString Project::ENGINE_VERSION = "1.3.0";
const QString Project::LAST_BUILD_DATE = "August 30 2019";
const int Project::MAX_PROJECTS_NUMBER = 6;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Project::Project() :
    p_currentMap(nullptr),
    p_currentMapConfig(nullptr),
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

bool Project::getSubVersions(QString& version, int& m, int& f, int& b) {
    QStringList list = version.split(".");
    if (list.size() != 3)
        return false;
    bool ok;
    int integer;
    integer = list.at(0).toInt(&ok);
    if (!ok)
        return false;
    m = integer;
    integer = list.at(1).toInt(&ok);
    if (!ok)
        return false;
    f = integer;
    integer = list.at(2).toInt(&ok);
    if (!ok)
        return false;
    b = integer;

    return true;
}

// -------------------------------------------------------

int Project::versionDifferent(QString projectVersion, QString otherVersion)
{
    int mProject, fProject, bProject, mEngine, fEngine, bEngine;
    bool ok = getSubVersions(projectVersion, mProject, fProject, bProject);
    bool ok2 = getSubVersions(otherVersion, mEngine, fEngine, bEngine);

    // Error while trying to convert one of the versions version
    if (!ok || !ok2)
        return -2;

    // If project <, return -1, if =, return 0, if > return 1
    if (mProject < mEngine)
        return -1;
    else if (mProject > mEngine)
        return 1;
    else {
        if (fProject < fEngine)
            return -1;
        else if (fProject > fEngine)
            return 1;
        else {
            if (bProject < bEngine)
                return -1;
            else if (bProject > bEngine)
                return 1;
            else
                return 0;
        }
    }
}

void Project::setDefault(){
    m_langsDatas->setDefault();
    m_keyBoardDatas->setDefaultGame();
    m_picturesDatas->setDefault();
    m_videosDatas->setDefault();
    m_songsDatas->setDefault();
    m_shapesDatas->setDefault();
    p_gameDatas->setDefault();
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
    QString information = "This project is under " + m_version + " version but"
                          + " your current RPG Paper Maker version is " +
                          Project::ENGINE_VERSION;

    int dBefore = Project::versionDifferent(m_version, "0.3.0");

    // If impossible to convert the version
    if (dBefore == -2) {
        QMessageBox::critical(nullptr, "Error: could not find project version",
                              "Impossible to convert" + m_version + ".");
        return false;
    }

    // If version < 0.3.0, tell that the project updater didn't existed yet
    if (dBefore == -1) {
        QMessageBox::critical(nullptr, "Error: impossible conversion",
                              information + " and the projects cannot be " +
                              "updated if the project version is inferior to " +
                              "0.3.0.");
        return false;
    }

    int d = Project::versionDifferent(m_version, Project::ENGINE_VERSION);

    // If the project if superior to the engine
    if (d == 1) {
        QMessageBox::critical(nullptr, "Error: impossible conversion",
                              information + ". Please try to update a new " +
                              "version of the engine and retry.");
        return false;
    }

    // If the project is inferior
    if (d == -1) {
        QDir dirProject(p_pathCurrentProject);
        QString previousFolderName = dirProject.dirName() +
                                     "-" + m_version;
        QMessageBox::StandardButton box =
            QMessageBox::question(nullptr, "Error: conversion needed",
                                  information + ". Convert the project? (a " +
                                  "copy of your current project will be " +
                                  "created under the name " + previousFolderName
                                  + ".",
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
        QString information = "This project is configured for " +
                RPM::ENUM_TO_STRING_OS_KIND.at(projectOSInteger) + " OS but you seems to be on " +
                RPM::ENUM_TO_STRING_OS_KIND.at(computerOSInteger) + " OS.";
        QString question = "Would you like to convert the project for " +
                RPM::ENUM_TO_STRING_OS_KIND.at(computerOSInteger) + " OS? (This will only keep" +
                " \"Content\" folder, and \"game.rpm\", all the other " +
                " files will be removed in the root of the project)";
        QMessageBox::StandardButton box =
                QMessageBox::question(nullptr, "Error: incompatible OS",
                             information + "\n" + question,
                             QMessageBox::Yes | QMessageBox::No);
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
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_LANGS), *m_langsDatas);
}

// -------------------------------------------------------

void Project::writeTreeMapDatas(){
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_TREE_MAP), *m_treeMapDatas);
}

// -------------------------------------------------------

void Project::writeScriptsDatas(){
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_SCRIPTS), *m_scriptsDatas);
}

// -------------------------------------------------------

void Project::writeKeyBoardDatas(){
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject,
                                        RPM::PATH_KEYBOARD), *m_keyBoardDatas);
}

// -------------------------------------------------------

void Project::writePicturesDatas(){
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_PICTURES_DATAS), *m_picturesDatas);
}

// -------------------------------------------------------

void Project::writeVideosDatas() {
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_VIDEOS_DATAS), *m_videosDatas);
}

// -------------------------------------------------------

void Project::writeSongsDatas() {
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_SONGS_DATAS), *m_songsDatas);
}

// -------------------------------------------------------

void Project::writeShapesDatas() {
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_SHAPES_DATAS), *m_shapesDatas);
}

// -------------------------------------------------------

void Project::writeSpecialsDatas() {
    Common::writeJSON(Common::pathCombine(p_pathCurrentProject,
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
        return "Error while creating game.rpm file";
    QTextStream out(&file);
    out << Project::ENGINE_VERSION;

    return NULL;
}

// -------------------------------------------------------

bool Project::isHeroDefined() const {
    return p_gameDatas->systemDatas()->idMapHero() != -1;
}
