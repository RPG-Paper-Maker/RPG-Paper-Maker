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

#include "dialogcommandmovecamera.h"
#include "ui_dialogcommandmovecamera.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandMoveCamera::DialogCommandMoveCamera(EventCommand *command,
                                                 SystemCommonObject *object,
                                                 QStandardItemModel *parameters,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveCamera),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

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

    if (command != nullptr) initialize(command);
}

DialogCommandMoveCamera::~DialogCommandMoveCamera()
{
    delete ui;

    if (Wanok::isInConfig)
        SuperListItem::deleteModel(m_modelObjects);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandMoveCamera::initialize(EventCommand* command) {

}

// -------------------------------------------------------

EventCommand* DialogCommandMoveCamera::getCommand() const {
    QVector<QString> command;

    return new EventCommand(EventCommandKind::MoveCamera, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandMoveCamera::on_radioButtonTargetUnchanged_toggled(
        bool checked)
{
    ui->spinBoxLevel->setEnabled(checked);
    ui->labelInInstance->setEnabled(checked);
    ui->comboBoxInstanceTeam->setEnabled(checked);
    ui->labelOfInstance->setEnabled(checked);
    ui->labelStockVariable->setEnabled(checked);
    ui->widgetVariableStock->setEnabled(checked);
    ui->radioButtonHero->setEnabled(checked);
    ui->radioButtonMonster->setEnabled(checked);
    ui->comboBoxHero->setEnabled(checked && ui->radioButtonHero->isChecked());
    ui->comboBoxMonster->setEnabled(checked && ui->radioButtonMonster
                                    ->isChecked());
}
