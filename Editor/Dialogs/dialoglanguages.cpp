/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoglanguages.h"
#include "ui_dialoglanguages.h"
#include "systemlanguage.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogLanguages::DialogLanguages(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogLanguages)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogLanguages::~DialogLanguages()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogLanguages::initialize()
{
    ui->treeViewLanguages->initializeNewItemInstance(new SystemLanguage);
    ui->treeViewLanguages->initializeModel(RPM::get()->project()->langsDatas()->model());
    ui->treeViewLanguages->setCanBeEmpty(false);
    ui->treeViewLanguages->setUpdateId(true);
}

// -------------------------------------------------------

void DialogLanguages::translate()
{
    this->setWindowTitle(RPM::translate(Translations::LANGUAGES_MANAGER) + RPM
        ::DOT_DOT_DOT);
    ui->tabWidget->setTabText(0, RPM::translate(Translations::LANGUAGES));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
