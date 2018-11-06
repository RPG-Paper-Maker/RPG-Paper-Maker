/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "dialoggeneraloptions.h"
#include "ui_dialoggeneraloptions.h"
#include "wanok.h"

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
    ui->comboBoxTheme->setCurrentIndex(static_cast<int>(Wanok::get()
        ->engineSettings()->theme()));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogGeneralOptions::accept() {
    Wanok::get()->engineSettings()->write();
    QDialog::accept();
}

// -------------------------------------------------------

void DialogGeneralOptions::reject() {
    Wanok::get()->engineSettings()->read();
    Wanok::get()->engineSettings()->updateTheme();
    QDialog::reject();
}

// -------------------------------------------------------

void DialogGeneralOptions::on_comboBoxThemeCurrentIndexChanged(int index) {
    Wanok::get()->engineSettings()->setTheme(static_cast<ThemeKind>(index));
}
