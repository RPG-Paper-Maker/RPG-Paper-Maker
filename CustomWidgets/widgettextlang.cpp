/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "widgettextlang.h"
#include "ui_widgettextlang.h"
#include "main.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTextLang::WidgetTextLang(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetTextLang)
{
    ui->setupUi(this);
}

WidgetTextLang::~WidgetTextLang()
{
    delete ui;
}

QLineEdit* WidgetTextLang::lineEdit() const { return ui->lineEdit; }

SystemLang* WidgetTextLang::lang() const { return m_lang; }

void WidgetTextLang::initializeNames(SystemLang* l){
    m_lang = l;
    l->names()->updateNames();
    l->setName(l->names()->mainName());

    lineEdit()->setText(l->name());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTextLang::on_lineEdit_textChanged(const QString &text){
    m_lang->setName(text);

    emit mainChanged(text);
}
