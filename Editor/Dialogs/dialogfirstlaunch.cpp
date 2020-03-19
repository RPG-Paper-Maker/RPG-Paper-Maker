/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogfirstlaunch.h"
#include "ui_dialogfirstlaunch.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogFirstLaunch::DialogFirstLaunch(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogFirstLaunch)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogFirstLaunch::~DialogFirstLaunch() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogFirstLaunch::initialize() {
    // Picture
    ui->widgetShowPicture->setDrawBackground(false);
    ui->widgetShowPicture->setActivateCoef(false);
    ui->widgetShowPicture->updatePictureByName(":/images/Ressources/kate.png");

    // Text
    ui->label->setText("<p>" + RPM::translate(Translations::FIRST_LAUNCH_1) +
        "</p><p>" + RPM::translate(Translations::FIRST_LAUNCH_2) + RPM::SPACE +
        "<strong>" + RPM::translate(Translations::FIRST_LAUNCH_3) + "</strong>"
        + RPM::DOT + RPM::SPACE + RPM::translate(Translations::FIRST_LAUNCH_4) +
        RPM::SPACE + "<a href=\"http://rpg-paper-maker.com/index.php/features\">"
        + RPM::translate(Translations::HERE) + "</a>.</p><p>" + RPM::SPACE + RPM
        ::translate(Translations::FIRST_LAUNCH_5) + RPM::SPACE + "<strong>" +
        RPM::translate(Translations::FIRST_LAUNCH_6) + RPM::SPACE +
        "</strong><a href=\"https://rpg-paper-maker.github.io/\">" + RPM
        ::translate(Translations::HERE) + "</a>.</p>");
}

// -------------------------------------------------------

void DialogFirstLaunch::translate() {
    this->setWindowTitle(RPM::translate(Translations::WELCOME_FIRST_LAUNCH));
    ui->pushButtonOK->setText(RPM::translate(Translations::OK));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogFirstLaunch::on_pushButtonOK_clicked() {
    this->accept();
}
