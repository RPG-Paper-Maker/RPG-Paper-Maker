/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QApplication>
#include <QFile>
#include <QStyleFactory>
#include <QStandardPaths>
#include <QDir>
#include "mainwindow.h"
#include "rpm.h"
#include "common.h"
#include "dialogfirstlaunch.h"

//-------------------------------------------------
//
//  MAIN : Configurations before executing app
//
//-------------------------------------------------

int main(int argc, char *argv[]) {
    QString realApplicationName, currentApplicationName;
    QDir bin;

    // Call resource constructor to avoid stripping resources from build on
    // static linking with Engine
    // See: https://wiki.qt.io/QtResources
    Q_INIT_RESOURCE(ressources);

    // Needed for being able to use QVector<int>
    qRegisterMetaType<QVector<int>>("QVector<int>");

    // OpenGL settings before creating app
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

    // Application creation
    QApplication a(argc, argv);

    // The application can now be used even if called from another directory
    bin = QDir(qApp->applicationDirPath());
    #ifdef Q_OS_MAC
        bin.cdUp();
        bin.cdUp();
        bin.cdUp();
    #endif
    QDir::setCurrent(bin.absolutePath());

    // Detect if applciation name need to be changed according to OS
    #ifdef Q_OS_WIN
        realApplicationName = "RPG Paper Maker.exe";
    #else
        realApplicationName = "RPG-Paper-Maker";
    #endif
    currentApplicationName = QFileInfo(qApp->arguments()[0]).fileName();
    if (currentApplicationName != realApplicationName) {
        QFile fileReal(Common::pathCombine(QDir::currentPath(),
            realApplicationName));
        if (fileReal.exists()) {
            while (!fileReal.remove()) {}
        }
        QFile(Common::pathCombine(QDir::currentPath(), currentApplicationName))
            .rename(realApplicationName);
    }

    // Load RPM settings
    RPM::get()->readEngineSettings();
    RPM::get()->readTranslations();

    // General stylesheet configuration
    RPM::get()->engineSettings()->updateTheme();
    qApp->setWindowIcon(QIcon(":/icons/icon.ico"));

    // Create document folder for games if not existing
    QDir dirDocuments(QStandardPaths::writableLocation(QStandardPaths
        ::StandardLocation::DocumentsLocation));
    if (dirDocuments.exists()) {
        if (!QDir(RPM::PATH_GAMES).exists()) {
            dirDocuments.mkdir(RPM::FOLDER_GAMES);
        }
    }

    // Opening window
    MainWindow *w = MainWindow::get();
    w->showMaximized();

    // Show first launch window
    DialogFirstLaunch dialog;
    if (RPM::get()->engineSettings()->firstTime()) {
        dialog.show();
        RPM::get()->engineSettings()->setFirstTime(false);
        RPM::get()->engineSettings()->write();
    }

    // Executing
    int result = a.exec();
    delete w;
    return result;
}
