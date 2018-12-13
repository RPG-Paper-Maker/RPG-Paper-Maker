/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "dialogsystemkeyboardgeneral.h"
#include "ui_dialogsystemkeyboardgeneral.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemKeyBoardGeneral::DialogSystemKeyBoardGeneral(SystemKeyBoard& key,
                                                         QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemKeyBoardGeneral),
    m_key(key)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemKeyBoardGeneral::~DialogSystemKeyBoardGeneral()
{
    delete ui;
}

SystemKeyBoard& DialogSystemKeyBoardGeneral::key() const { return m_key; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemKeyBoardGeneral::initialize(){
    ui->lineEditAbbreviation->setText(m_key.abbreviation());
    ui->lineEditDescription->setText(m_key.name());
    ui->labelShortcut->setText(m_key.shortCutString());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemKeyBoardGeneral::on_pushButtonChange_clicked(){
    SystemKeyBoard key;
    key.setCopy(m_key);
    DialogSystemKeyBoard dialog(key);
    if (dialog.exec() == QDialog::Accepted){
        m_key.setCopy(key);
        ui->labelShortcut->setText(m_key.shortCutString());
    }
}

// -------------------------------------------------------

void DialogSystemKeyBoardGeneral::on_lineEditAbbreviation_textChanged(
        const QString &text)
{
    m_key.setAbbreviation(text);
}

// -------------------------------------------------------

void DialogSystemKeyBoardGeneral::on_lineEditDescription_textChanged(
        const QString &text)
{
    m_key.setName(text);
}
