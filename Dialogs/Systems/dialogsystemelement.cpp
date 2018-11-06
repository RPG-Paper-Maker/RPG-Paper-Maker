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

#include "dialogsystemelement.h"
#include "ui_dialogsystemelement.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemElement::DialogSystemElement(SystemElement& element,
                                         QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemElement),
    m_element(element)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemElement::~DialogSystemElement()
{
    delete ui;
}

SystemElement& DialogSystemElement::element() const { return m_element; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemElement::initialize(){
    ui->widgetTxtLangName->initializeNames(&m_element);

    ui->treeViewEfficiency->setModel(m_element.efficiency());
    ui->treeViewEfficiency->setColumnWidth(0,250);
}
