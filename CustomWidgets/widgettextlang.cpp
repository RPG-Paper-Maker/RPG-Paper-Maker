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
    ui(new Ui::WidgetTextLang),
    m_l(nullptr),
    m_lang(nullptr)
{
    ui->setupUi(this);
}

WidgetTextLang::~WidgetTextLang()
{
    delete ui;
}

QLineEdit* WidgetTextLang::lineEdit() const { return ui->lineEdit; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTextLang::initializeNamesTrans(LangsTranslation *l) {
    m_l = l;

    initializeNames();
}

// -------------------------------------------------------

void WidgetTextLang::initializeNamesLang(SystemLang *lang) {
    m_lang = lang;
    m_l = lang->names();

    initializeNames();
}

// -------------------------------------------------------

void WidgetTextLang::initializeNames() {
    QString mainName;
    m_l->updateNames();
    mainName = m_l->mainName();
    if (m_lang != nullptr) {
        m_lang->setName(mainName);
    }

    lineEdit()->setText(mainName);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTextLang::on_lineEdit_textChanged(const QString &text) {
    if (m_lang != nullptr) {
        m_lang->setName(text);
    }
    m_l->setMainName(text);

    emit mainChanged(text);
}
