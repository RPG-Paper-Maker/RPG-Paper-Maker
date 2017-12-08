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

#include "widgetvariable.h"
#include "ui_widgetvariable.h"
#include "superlistitem.h"
#include "dialogvariables.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetVariable::WidgetVariable(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetVariable)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(),
                            ui->listWidget->height() - 4));
    ui->listWidget->addItem(item);
}

WidgetVariable::~WidgetVariable()
{
    delete ui;
}

int WidgetVariable::currentId() const { return p_currentId; }

void WidgetVariable::setCurrentId(int i) {
    if (i < 1) i = 1;
    p_currentId = i;

    VariablesDatas* datas = Wanok::get()->project()->gameDatas()
                                    ->variablesDatas();

    // Graphic update
    SuperListItem* s = datas->getVariableById(p_currentId);

    if (s == nullptr){
        p_currentId = 1;
        s = datas->getVariableById(p_currentId);
    }
    ui->listWidget->item(0)->setText(s->toString());
}

QListWidget* WidgetVariable::list() const { return ui->listWidget; }

void WidgetVariable::initialize(int i){
    setCurrentId(i);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetVariable::openDialog(){
    DialogVariables dialog;
    VariablesDatas* datas = Wanok::get()->project()->gameDatas()
                                    ->variablesDatas();
    QStandardItemModel* m = datas->model();

    dialog.initializeModel(m);
    if (dialog.exec() == QDialog::Accepted){
        setCurrentId(dialog.getSelectedId());
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetVariable::on_listWidget_itemDoubleClicked(QListWidgetItem*){
    openDialog();
}

// -------------------------------------------------------

void WidgetVariable::on_pushButton_clicked(){
    openDialog();
}
