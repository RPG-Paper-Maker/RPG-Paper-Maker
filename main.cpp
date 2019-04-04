/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include <QApplication>
#include <QFile>
#include <QStyleFactory>
#include <QStandardPaths>
#include <QDir>
#include "mainwindow.h"
#include "rpm.h"
#include "common.h"

//-------------------------------------------------
//
//  MAIN
//
//-------------------------------------------------

int main(int argc, char *argv[])
{
    qRegisterMetaType<QVector<int>>("QVector<int>");

    #ifdef Q_OS_WIN
        QCoreApplication::setAttribute(Qt::AA_UseOpenGLES);
        RPM::shadersExtension = "";
    #endif
    #ifdef Q_OS_MAC
        RPM::shadersExtension = "-3.3";
        QSurfaceFormat glFormat;
        glFormat.setVersion(3, 3);
        glFormat.setProfile(QSurfaceFormat::CoreProfile);
        QSurfaceFormat::setDefaultFormat(glFormat);
    #endif

    QApplication a(argc, argv);

    // The application can now be used even if called from another directory
    QDir bin(qApp->applicationDirPath());
    #ifdef Q_OS_MAC
        bin.cdUp();
        bin.cdUp();
        bin.cdUp();
    #endif
    QDir::setCurrent(bin.absolutePath());

    // Detect if applciation name need to be changed
    QString realApplicationName;
    #ifdef Q_OS_WIN
        realApplicationName = "RPG Paper Maker.exe";
    #else
        realApplicationName = "RPG-Paper-Maker";
    #endif
    QString currentApplicationName = QFileInfo(qApp->arguments()[0]).fileName();

    if (currentApplicationName != realApplicationName) {
        QString pathReal = Common::pathCombine(QDir::currentPath(),
            realApplicationName);
        QFile fileReal(pathReal);
        if (fileReal.exists()) {
            while (!fileReal.remove()) {}
        }
        QFile(Common::pathCombine(QDir::currentPath(), currentApplicationName))
            .rename(realApplicationName);
    }

    // Load engine settings
    EngineSettings *engineSettings = new EngineSettings;
    QFile fileSettings(Common::pathCombine(QDir::currentPath(),
        RPM::pathEngineSettings));
    if (fileSettings.exists()) {
        engineSettings->read();
    } else {
        engineSettings->setDefault();
        engineSettings->write();
    }
    RPM::get()->setEngineSettings(engineSettings);

    // General stylesheet configuration
    engineSettings->updateTheme();
    qApp->setWindowIcon(QIcon(":/icons/Ressources/icon.ico"));

    // Create document folder for games if not existing
    QString documentsPath = QStandardPaths::writableLocation(
        QStandardPaths::StandardLocation::DocumentsLocation);
    QDir dirDocuments(documentsPath);
    if (dirDocuments.exists()) {
        QString gamesPath = RPM::dirGames;
        QDir dirGames(gamesPath);
        if (!dirGames.exists()) {
            dirDocuments.mkdir(RPM::gamesFolderName);
        }
    }

    // Opening window
    MainWindow w;
    w.showMaximized();

    // Executing
    return a.exec();
}
