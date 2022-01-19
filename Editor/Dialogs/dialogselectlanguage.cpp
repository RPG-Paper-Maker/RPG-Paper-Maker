/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogselectlanguage.h"
#include "ui_dialogselectlanguage.h"
#include "rpm.h"
#include "mainwindow.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSelectLanguage::DialogSelectLanguage(QString lang, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSelectLanguage)
{
    ui->setupUi(this);

    this->initialize(lang);

    this->translate();
}

DialogSelectLanguage::~DialogSelectLanguage()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSelectLanguage::initialize(QString &lang)
{
    int index;
    index = RPM::get()->translations()->indexOfLanguagesShort(lang);
    if (index == -1)
    {
        index = RPM::get()->translations()->indexOfLanguagesShort(RPM::get()
            ->engineSettings()->currentLanguage());
    } else {
        RPM::get()->engineSettings()->setCurrentLanguage(lang);
    }
    ui->comboBox->addItems(RPM::get()->translations()->languagesNames());
    ui->comboBox->setCurrentIndex(index);
}

// -------------------------------------------------------

void DialogSelectLanguage::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_LANGUAGE) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonOK->setText(RPM::translate(Translations::OK));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSelectLanguage::on_comboBox_currentIndexChanged(int index)
{
    RPM::get()->engineSettings()->setCurrentLanguage(RPM::get()->translations()
        ->languagesShortAt(index));
    RPM::get()->readTranslations();
    MainWindow::get()->translate();
    MainWindow::get()->dialogScripts()->translate();
    this->translate();
    RPM::get()->engineSettings()->write();
}
