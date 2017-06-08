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

#include "widgetvariableswitch.h"
#include "ui_widgetvariableswitch.h"
#include "superlistitem.h"
#include "dialogvariables.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetVariableSwitch::WidgetVariableSwitch(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetVariableSwitch)
{
    isVariable = true;
    ui->setupUi(this);
    ui->listWidget->addItem("test");
}

WidgetVariableSwitch::~WidgetVariableSwitch()
{
    delete ui;
}

void WidgetVariableSwitch::setVariable(bool b) { isVariable = b; }

int WidgetVariableSwitch::currentId() const { return p_currentId; }

void WidgetVariableSwitch::setCurrentId(int i) {
    if (i < 1) i = 1;
    p_currentId = i;

    VariablesSwitchesDatas* datas = Wanok::get()->project()->gameDatas()
                                    ->variablesSwitchesDatas();

    // Graphic update
    SuperListItem* s = (isVariable) ? datas->getVariableById(p_currentId)
                                    : datas->getSwitchById(p_currentId);
    if (s == nullptr){
        p_currentId = 1;
        s = (isVariable) ? datas->getVariableById(p_currentId)
                         : datas->getSwitchById(p_currentId);
    }
    ui->listWidget->item(0)->setText(s->toString());
}

QListWidget* WidgetVariableSwitch::list() const { return ui->listWidget; }

void WidgetVariableSwitch::initialize(int i){
    setCurrentId(i);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetVariableSwitch::openDialog(){
    DialogVariables dialog;
    VariablesSwitchesDatas* datas = Wanok::get()->project()->gameDatas()
                                    ->variablesSwitchesDatas();
    QStandardItemModel* m = (isVariable) ? datas->modelVariables()
                                         : datas->modelSwitches();
    if (!isVariable) dialog.applyAsSwitches();
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

void WidgetVariableSwitch::on_listWidget_itemDoubleClicked(QListWidgetItem*){
    openDialog();
}

// -------------------------------------------------------

void WidgetVariableSwitch::on_pushButton_clicked(){
    openDialog();
}
