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
    ui->label->setText("<p>Welcome to RPG Paper Maker!</p><p>First, be aware "
        "that <strong>this tool is under heavy, active development and is in "
        "early stages</strong>. Your patience is appreciated while more "
        "advanced and commercial-quality features are implemented. Check out "
        "the features development <a href=\"http://rpg-paper-maker.com/index"
        ".php/features\">here</a>.</p><p>You can also find <strong>guides for "
        "using RPG Paper Maker like a pro</strong> <a href=\"https://rpg-paper-"
        "maker.github.io/\">here</a>.</p>");
}

// -------------------------------------------------------

void DialogFirstLaunch::translate() {
    this->setWindowTitle(RPM::translate(Translations::COLLISIONS_MANAGER));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogFirstLaunch::on_pushButtonOK_clicked() {
    this->accept();
}
