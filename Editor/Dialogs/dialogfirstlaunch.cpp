/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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

void DialogFirstLaunch::initialize()
{
    this->setWindowTitle(RPM::translate(Translations::WELCOME_FIRST_LAUNCH));

    // Picture
    ui->widgetShowPicture->setDrawBackground(false);
    ui->widgetShowPicture->setActivateCoef(false);
    ui->widgetShowPicture->updatePictureByName(":/images/Ressources/kate.png");

    // Text
    ui->label->setText("<p>" + RPM::translate(Translations::FIRST_LAUNCH_1) +
        "</p><p>" + RPM::translate(Translations::FIRST_LAUNCH_2) + RPM::SPACE +
        "<strong>" + RPM::translate(Translations::FIRST_LAUNCH_3) + "</strong>"
        + RPM::DOT + RPM::SPACE + RPM::translate(Translations::FIRST_LAUNCH_4) +
        RPM::SPACE + "<a href=\"http://rpg-paper-maker.com/index.php/features\""
        " style=\"color: tomato;\">" + RPM::translate(Translations::HERE) +
        "</a>.</p><p>" + RPM::SPACE + RPM::translate(Translations
        ::FIRST_LAUNCH_5) + RPM::SPACE + "<strong>" + RPM::translate(
        Translations::FIRST_LAUNCH_6) + RPM::SPACE +
        "</strong><a href=\"https://rpg-paper-maker.gitbook.io/rpg-paper-maker/"
        "\" style=\"color: tomato;\">" + RPM::translate(Translations::HERE) +
        "</a>.</p>");
}

// -------------------------------------------------------

void DialogFirstLaunch::initializePatreon()
{
    this->setWindowTitle("Patreon");
    ui->label->setText(RPM::translate(Translations::MESSAGE_PATREON).arg(
        "<a href=\"https://www.patreon.com/rpgpapermaker\" style=\"color: tomato;\">Patreon</a>",
        "<a href=\"https://www.paypal.com/donate?token=i3T2GlIaJxmvEUGBVT_XoVLYiP0AoxPrrfW8uudskRvlhEEVfuQPYZDpNU9k07VosMAnar71etRyzNzj\" style=\"color: tomato;\">Paypal</a>",
        "<a href=\"https://store.steampowered.com/app/1118650/RPG_Paper_Maker__Commercial_edition/\" style=\"color: tomato;\">Steam</a>"
    ));
}

// -------------------------------------------------------

void DialogFirstLaunch::translate() {
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
