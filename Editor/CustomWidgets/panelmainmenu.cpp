/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDesktopServices>
#include <QDir>
#include <QMessageBox>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include "mainwindow.h"
#include "panelmainmenu.h"
#include "ui_panelmainmenu.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelMainMenu::PanelMainMenu(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelMainMenu)
{
    ui->setupUi(this);
    ui->pushButtonNewProject->setAutoFillBackground(true);
    ui->widgetPatreon->updateImage(":/images/Ressources/become-patreon.png", 0.5);
    ui->labelCommercial->setTextFormat(Qt::RichText);
    ui->labelCommercial->setTextInteractionFlags(Qt::TextBrowserInteraction);
    ui->labelCommercial->setOpenExternalLinks(true);
    this->translate();
}

PanelMainMenu::~PanelMainMenu()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelMainMenu::loadContents()
{
    /*
    // News
    QNetworkAccessManager manager;
    QNetworkReply *reply;
    QEventLoop loop;
    QJsonObject obj;
    QJsonArray json;
    reply = manager.get(QNetworkRequest(QUrl("https://raw.githubusercontent.com/"
        "RPG-Paper-Maker/RPG-Paper-Maker/develop/News/content.json")));
    this->connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    if (reply->error() == QNetworkReply::NetworkError::NoError) {
        json = QJsonDocument::fromJson(reply->readAll()).array();
    }
    reply = manager.get(QNetworkRequest(QUrl("https://raw.githubusercontent.com/"
        "RPG-Paper-Maker/RPG-Paper-Maker/develop/News/1.png")));
    this->connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    if (reply->error() == QNetworkReply::NetworkError::NoError) {
        QImage image;
        image.loadFromData(reply->readAll());
        obj = json[0].toObject();
        ui->widgetNews1->update(obj["title"].toString(), image, obj["link"].toString());
    }
    reply = manager.get(QNetworkRequest(QUrl("https://raw.githubusercontent.com/"
        "RPG-Paper-Maker/RPG-Paper-Maker/develop/News/2.png")));
    this->connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    if (reply->error() == QNetworkReply::NetworkError::NoError) {
        QImage image;
        image.loadFromData(reply->readAll());
        obj = json[1].toObject();
        ui->widgetNews2->update(obj["title"].toString(), image, obj["link"].toString());
    }*/

    // Recent projects
    this->connect(ui->panelRecentProjects, SIGNAL(openingProject(QString)), this
        , SLOT(openRecentProject(QString)));
}

// -------------------------------------------------------

void PanelMainMenu::translate()
{
    ui->pushButtonExampleProject->setText(RPM::translate(Translations
        ::EXAMPLE_PROJECT) + RPM::DOT_DOT_DOT);
    ui->pushButtonNewProject->setText(RPM::translate(Translations::NEW_PROJECT)
        + RPM::DOT_DOT_DOT);
    ui->pushButtonOpenProject->setText(RPM::translate(Translations::OPEN_PROJECT
        ) + RPM::DOT_DOT_DOT);
    ui->labelHelpEngine->setText(RPM::translate(Translations::HELP_ENGINE_1));
    ui->labelCommercial->setText("<a href=\"https://store.steampowered.com/app/"
        "1118650/RPG_Paper_Maker__Commercial_edition/\" style=\"color: tomato;"
        "\">" + RPM::translate(Translations::HELP_ENGINE_2) + "</a> " + RPM
        ::translate(Translations::HELP_ENGINE_3));
    ui->panelRecentProjects->translate();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelMainMenu::on_pushButtonExampleProject_clicked()
{
    QMessageBox::information(this, RPM::translate(Translations::WARNING), RPM
        ::translate(Translations::PROJECT_DEMO_ANY_SAVE_WONT_CONSERVED) + RPM
        ::DOT);
    this->openRecentProject(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_EXAMPLE_GAME));
}

// -------------------------------------------------------

void PanelMainMenu::on_pushButtonNewProject_clicked()
{
    reinterpret_cast<MainWindow *>(parent()->parent())->newProject();
}

// -------------------------------------------------------

void PanelMainMenu::on_pushButtonOpenProject_clicked()
{
    reinterpret_cast<MainWindow *>(parent()->parent())->openExistingProject();
}

// -------------------------------------------------------

void PanelMainMenu::openRecentProject(QString path)
{
    emit openingProject(path);
}

// -------------------------------------------------------

void PanelMainMenu::on_widgetPatreon_clicked()
{
    QDesktopServices::openUrl(QUrl("https://www.patreon.com/bePatron?u=14575421"));
}
