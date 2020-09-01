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

const QString Project::ENGINE_VERSION = "1.5.5";
const QString Project::LAST_BUILD_DATE = "July 6 2020";
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

QString Project::pathCurrentProjectApp() const
{
    return p_pathCurrentProjectApp;
}

void Project::setPathCurrentProject(QString s)
{
    p_pathCurrentProject = s;
    p_pathCurrentProjectApp = Common::pathCombine(s, RPM::PATH_APP);
}

void Project::setPathCurrentProjectApp(QString s)
{
    p_pathCurrentProjectApp = s;
}

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
    p_gameDatas->readAnimations(this->pathCurrentProjectApp());
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
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR_MESSAGE) + RPM
            ::COLON + RPM::SPACE + RPM::translate(Translations
            ::COULD_NOT_FIND_PROJECT_VERSION) + RPM::DOT, RPM::translate(
            Translations::IMPOSSIBLE_TO_CONVERT) + RPM::SPACE + m_version + RPM
            ::DOT);
        return false;
    }

    // If version < 0.3.0, tell that the project updater didn't existed yet
    if (dBefore == -1) {
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR_MESSAGE) + RPM
            ::COLON + RPM::SPACE + RPM::translate(Translations
            ::IMPOSSIBLE_CONVERSION_1), information + RPM::SPACE + RPM
            ::translate(Translations::IMPOSSIBLE_CONVERSION_2) + RPM::DOT);
        return false;
    }

    int d = Common::versionDifferent(m_version, Project::ENGINE_VERSION);

    // If the project if superior to the engine
    if (d == 1) {
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR_MESSAGE) + RPM
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
            ::translate(Translations::ERROR_MESSAGE) + RPM::COLON + RPM::SPACE + RPM
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
            ::translate(Translations::ERROR_MESSAGE) + RPM::COLON + RPM::SPACE + RPM
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
    else if (QFile(Common::pathCombine(p_pathCurrentProject,"Game")).exists())
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
    QString pathContent = Common::pathCombine(QDir::currentPath(), RPM
        ::FOLDER_CONTENT);
    QString pathMain = Common::pathCombine(pathContent, RPM::FILE_MAIN);
    QString pathIndex = Common::pathCombine(pathContent, RPM::FILE_INDEX);
    QString pathPackage = Common::pathCombine(pathContent, RPM::FILE_PACKAGE);

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
    if (!Common::copyPath(Common::pathCombine(pathContent, strOS),
        p_pathCurrentProject))
    {
        return false;
    }

    // Copy extra files for desktop
    if (!QFile::copy(pathMain, Common::pathCombine(p_pathCurrentProject, RPM
        ::PATH_MAIN)) || !QFile::copy(pathIndex, Common::pathCombine(
        p_pathCurrentProject, RPM::PATH_INDEX)) || !QFile::copy(pathPackage,
        Common::pathCombine(p_pathCurrentProject, RPM::PATH_PACKAGE)))
    {
        return false;
    }

    return true;
}

// -------------------------------------------------------

void Project::removeOSFiles() {
    QString path;
    #ifdef Q_OS_MACOS
        QDirIterator d1(p_pathCurrentProject, QDir::Dirs | QDir::NoDotAndDotDot);
        QDirIterator f1(p_pathCurrentProject, QDir::Files);
        while (d1.hasNext())
        {
            d1.next();
            // Remove everything but Game.app
            if (d1.fileName() == "Game.app")
            {
                QString p2 = Common::pathCombine(p_pathCurrentProject,
                    "Game.app");
                QDirIterator d2(p2, QDir::Dirs | QDir::NoDotAndDotDot);
                QDirIterator f2(p2, QDir::Files);
                while (d2.hasNext())
                {
                    d2.next();
                    // Remove everything but Contents
                    if (d2.fileName() != "Contents")
                    {
                        QDir(d2.filePath()).removeRecursively();
                    } else
                    {
                        path = Common::pathCombine(p2, "Contents");
                    }
                }
                while (f2.hasNext())
                {
                    f2.next();
                    QFile(f2.filePath()).remove();
                }
            } else
            {
                QDir(d1.filePath()).removeRecursively();
            }
        }
        while (f1.hasNext())
        {
            f1.next();
            if (f1.fileName() != "game.rpm")
            {
                QFile(f1.filePath()).remove();
            }
        }
    #else
        path = p_pathCurrentProject;
    #endif


    QDirIterator d3(path, QDir::Dirs | QDir::NoDotAndDotDot);
    QDirIterator f3(path, QDir::Files);

    // Remove directories
    while (d3.hasNext())
    {
        d3.next();

        // Remove everything but resources
        if (d3.fileName() == RPM::FOLDER_RESOURCES)
        {
            path = Common::pathCombine(path, RPM::FOLDER_RESOURCES);
            QDirIterator d4(path, QDir::Dirs | QDir::NoDotAndDotDot);
            QDirIterator f4(path, QDir::Files);
            while (d4.hasNext())
            {
                d4.next();

                // Remove everything but app
                if (d4.fileName() == RPM::FOLDER_APP)
                {
                    path = Common::pathCombine(path, RPM::FOLDER_APP);
                    QDirIterator d5(path, QDir::Dirs | QDir::NoDotAndDotDot);
                    QDirIterator f5(path, QDir::Files);
                    while (d5.hasNext())
                    {
                        d5.next();

                        // Remove everything but Content
                        if (d5.fileName() != RPM::FOLDER_CONTENT)
                        {
                            QDir(d5.filePath()).removeRecursively();
                        }
                    }
                    while (f5.hasNext())
                    {
                        f5.next();
                        QFile(f5.filePath()).remove();
                    }
                } else
                {
                    QDir(d4.filePath()).removeRecursively();
                }
            }
            while (f4.hasNext())
            {
                f4.next();
                QFile(f4.filePath()).remove();
            }
        } else
        {
            QDir(d3.filePath()).removeRecursively();
        }
    }

    // Remove files exept game.rpm
    while (f3.hasNext())
    {
        f3.next();
        if (f3.fileName() != "game.rpm")
        {
            QFile(f3.filePath()).remove();
        }
    }
}

// -------------------------------------------------------

void Project::readGameDatas(){
    p_gameDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readLangsDatas(){
    m_langsDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readTreeMapDatas(){
    m_treeMapDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readScriptsDatas(){
    m_scriptsDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readKeyBoardDatas(){
    m_keyBoardDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readPicturesDatas(){
    m_picturesDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readVideosDatas() {
    m_videosDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readSongsDatas(){
    m_songsDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readShapesDatas(){
    m_shapesDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readSpecialsDatas() {
    m_specialElementsDatas->read(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readSystemDatas(){
    p_gameDatas->readSystem(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readBattleSystemDatas() {
    p_gameDatas->readBattleSystem(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readTilesetsDatas() {
    p_gameDatas->readTilesets(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readCommonEvents() {
    p_gameDatas->readCommonEvents(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readTitleScreenGameOver() {
    p_gameDatas->readTitleScreenGameOver(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::readDlcs()
{
    p_gameDatas->readDlcs(this->pathCurrentProjectApp());
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
    p_gameDatas->write(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::writeLangsDatas(){
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(),
                                        RPM::PATH_LANGS), *m_langsDatas);
}

// -------------------------------------------------------

void Project::writeTreeMapDatas(){
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(),
                                        RPM::PATH_TREE_MAP), *m_treeMapDatas);
}

// -------------------------------------------------------

void Project::writeScriptsDatas(){
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(),
                                        RPM::PATH_SCRIPTS), *m_scriptsDatas);
}

// -------------------------------------------------------

void Project::writeKeyBoardDatas(){
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(),
                                        RPM::PATH_KEYBOARD), *m_keyBoardDatas);
}

// -------------------------------------------------------

void Project::writePicturesDatas(){
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(), RPM
        ::PATH_PICTURES_DATAS), *m_picturesDatas);
}

// -------------------------------------------------------

void Project::writeVideosDatas() {
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(), RPM
        ::PATH_VIDEOS_DATAS), *m_videosDatas);
}

// -------------------------------------------------------

void Project::writeSongsDatas() {
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(), RPM
        ::PATH_SONGS_DATAS), *m_songsDatas);
}

// -------------------------------------------------------

void Project::writeShapesDatas() {
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(), RPM
        ::PATH_SHAPES_DATAS), *m_shapesDatas);
}

// -------------------------------------------------------

void Project::writeSpecialsDatas() {
    RPM::writeJSON(Common::pathCombine(this->pathCurrentProjectApp(),
                                        RPM::PATH_SPECIAL_ELEMENTS),
                     *m_specialElementsDatas);
}

// -------------------------------------------------------

void Project::writeSystemDatas(){
    p_gameDatas->writeSystem(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::writeBattleSystemDatas() {
    p_gameDatas->writeBattleSystem(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::writeTilesetsDatas() {
    p_gameDatas->writeTilesets(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::writeCommonEvents() {
    p_gameDatas->writeCommonEvents(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::writeTitleScreenGameOver() {
    p_gameDatas->writeTitleScreenGameOver(this->pathCurrentProjectApp());
}

// -------------------------------------------------------

void Project::writeDlcs()
{
    p_gameDatas->writeDlcs(this->pathCurrentProjectApp());
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
