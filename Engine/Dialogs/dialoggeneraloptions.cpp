/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialoggeneraloptions.h"
#include "ui_dialoggeneraloptions.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogGeneralOptions::DialogGeneralOptions(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogGeneralOptions)
{
    ui->setupUi(this);
    

    initialize();
}

DialogGeneralOptions::~DialogGeneralOptions()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogGeneralOptions::initialize() {
    QStringList themes;
    themes << "Dark" << "White";
    ui->comboBoxTheme->addItems(themes);

    connect(ui->comboBoxTheme, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxThemeCurrentIndexChanged(int)));
    ui->comboBoxTheme->setCurrentIndex(static_cast<int>(RPM::get()
        ->engineSettings()->theme()));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogGeneralOptions::accept() {
    RPM::get()->engineSettings()->write();
    QDialog::accept();
}

// -------------------------------------------------------

void DialogGeneralOptions::reject() {
    RPM::get()->engineSettings()->read();
    RPM::get()->engineSettings()->updateTheme();
    QDialog::reject();
}

// -------------------------------------------------------

void DialogGeneralOptions::on_comboBoxThemeCurrentIndexChanged(int index) {
    RPM::get()->engineSettings()->setTheme(static_cast<ThemeKind>(index));
}
