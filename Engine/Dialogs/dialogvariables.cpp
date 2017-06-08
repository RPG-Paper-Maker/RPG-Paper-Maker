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

#include "dialogvariables.h"
#include "systemvariableswitch.h"
#include "ui_dialogvariables.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogVariables::DialogVariables(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogVariables)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->panelList->showButtonMax(false);

    // Connection
    connect(ui->panelListPages->list(),
            SIGNAL(clicked(QModelIndex)), this,
            SLOT(on_pageSelected(QModelIndex)));
}

DialogVariables::~DialogVariables()
{
    delete ui;
}

void DialogVariables::initializeModel(QStandardItemModel* m){
    ui->panelListPages->list()->initializeModel(m);
    QModelIndex index = ui->panelListPages->list()->getModel()->index(0,0);
    ui->panelListPages->list()->setCurrentIndex(index);
    on_pageSelected(index);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogVariables::applyAsSwitches(){
    this->setWindowTitle("Switches");
    ui->groupBox->setTitle("Switches");
}

// -------------------------------------------------------

int DialogVariables::getSelectedId() const{
    QStandardItem* selected = ui->panelList->list()->getModel()
            ->itemFromIndex(ui->panelList->list()->selectionModel()
                            ->currentIndex());
    return ((SuperListItem*)selected->data().value<quintptr>())->id();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogVariables::on_pageSelected(QModelIndex index){
    QStandardItem* selected = ui->panelListPages->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr){
        ui->panelList->list()
                ->initializeModel(((SystemVariableSwitch*)selected->data()
                                   .value<quintptr>())->model());
        ui->panelList->list()->setCurrentIndex(ui->panelList->list()
                                               ->getModel()->index(0,0));
    }
}

// -------------------------------------------------------

void DialogVariables::on_buttonBox_clicked(QAbstractButton *button){
    if((QPushButton*)button == ui->buttonBox->button(QDialogButtonBox::Ok)){
        Wanok::writeJSON(Wanok::pathCombine(Wanok::get()->project()
                                            ->pathCurrentProject(),
                                            Wanok::pathVariablesSwitches),
                         *(Wanok::get()->project()->gameDatas()
                           ->variablesSwitchesDatas()));
    }
    else if ((QPushButton*)button == ui->buttonBox
             ->button(QDialogButtonBox::Cancel))
    {
        Wanok::get()->project()->gameDatas()
                ->readVariablesSwitches(Wanok::get()->project()
                                        ->pathCurrentProject());
    }
}
