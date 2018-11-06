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

#include "dialogcommandmoveobject.h"
#include "ui_dialogcommandmoveobject.h"
#include "wanok.h"
#include "systemcommandmove.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandMoveObject::DialogCommandMoveObject(EventCommand *command,
                                                 SystemCommonObject *object,
                                                 QStandardItemModel *parameters,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveObject),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);
    

    if (Wanok::isInConfig){
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = Wanok::get()->project()->currentMap()->modelObjects();
    }
    ui->widgetPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
                                                             parameters,
                                                             nullptr);

    // Empty tree of move commands
    QStandardItemModel* model = new QStandardItemModel;
    ui->treeView->initializeModel(model);
    ui->treeView->setHasContextMenu(false);
    ui->treeView->setCanBeControled(false);

    if (command != nullptr) initialize(command);

    QStandardItem* item = new QStandardItem;
    item->setText(SuperListItem::beginningText);
    model->appendRow(item);
    ui->treeView->setCurrentIndex(model->index(model->invisibleRootItem()
                                               ->rowCount()-1, 0));
}

DialogCommandMoveObject::~DialogCommandMoveObject()
{
    SuperListItem::deleteModel(ui->treeView->getModel());

    delete ui;

    if (Wanok::isInConfig)
        SuperListItem::deleteModel(m_modelObjects);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandMoveObject::initialize(EventCommand* command){
    int i = 0;
    QStandardItemModel* model = ui->treeView->getModel();
    QStandardItem* item;
    SystemCommandMove* move;

    // Object ID
    ui->widgetPrimitiveObjectID->initializeCommand(command, i);

    // Options
    ui->checkBoxIgnore->setChecked(command->valueCommandAt(i++) == "1");
    ui->checkBoxWaitEnd->setChecked(command->valueCommandAt(i++) == "1");
    ui->checkBoxCameraOrientation->setChecked(command->valueCommandAt(i++)
                                              == "1");

    // List of move commands
    while(i < command->commandsCount()){
        move = new SystemCommandMove;
        move->initialize(command, i);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(move)));
        item->setText(move->toString());
        model->appendRow(item);
    }
}

// -------------------------------------------------------

void DialogCommandMoveObject::addMoveStepSquare(CommandMoveKind kind){
    QString k = QString::number((int) kind);
    QString stepSquare = QString::number(ui->comboBoxStepSquare
                                         ->currentIndex());
    SystemCommandMove* move =
            new SystemCommandMove(-1, "", QVector<QString>({k, stepSquare}));
    QList<QStandardItem*> row =  move->getModelRow();
    ui->treeView->getModel()->insertRow(ui->treeView->getSelected()->row(),
                                        row);
}

// -------------------------------------------------------

EventCommand* DialogCommandMoveObject::getCommand() const{
    QVector<QString> command;
    int l;

    // Object ID
    ui->widgetPrimitiveObjectID->getCommand(command);

    // Options
    command.append(ui->checkBoxIgnore->isChecked() ? "1" : "0");
    command.append(ui->checkBoxWaitEnd->isChecked() ? "1" : "0");
    command.append(ui->checkBoxCameraOrientation->isChecked() ? "1" : "0");

    // List of move commands
    l = ui->treeView->getModel()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        ((SystemCommandMove*) ui->treeView->getModel()->item(i)->data()
        .value<quintptr>())->getCommand(command);
    }

    return new EventCommand(EventCommandKind::MoveObject, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareNorth_clicked(){
    addMoveStepSquare(CommandMoveKind::MoveNorth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouth_clicked(){
    addMoveStepSquare(CommandMoveKind::MoveSouth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareWest_clicked(){
    addMoveStepSquare(CommandMoveKind::MoveWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareEast_clicked(){
    addMoveStepSquare(CommandMoveKind::MoveEast);
}
