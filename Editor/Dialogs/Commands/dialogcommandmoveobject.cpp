/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandmoveobject.h"
#include "ui_dialogcommandmoveobject.h"
#include "rpm.h"
#include "systemcommandmove.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandMoveObject::DialogCommandMoveObject(EventCommand *command,
                                                 SystemCommonObject *,
                                                 QStandardItemModel *parameters,
                                                 bool idObjectFixed,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveObject),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);

    QSizePolicy sp_retain;
    sp_retain = ui->pushButtonEmpty->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->pushButtonEmpty->setSizePolicy(sp_retain);
    ui->pushButtonEmpty->hide();
    
    if (idObjectFixed) {
        ui->labelObjectID->hide();
        ui->widgetPrimitiveObjectID->hide();
        ui->horizontalSpacer->changeSize(0, 0);
    }

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
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

    this->translate();
}

DialogCommandMoveObject::~DialogCommandMoveObject()
{
    SuperListItem::deleteModel(ui->treeView->getModel());

    delete ui;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------

void DialogCommandMoveObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

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
    this->addMoveStepSquare(CommandMoveKind::MoveNorth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouth_clicked(){
    this->addMoveStepSquare(CommandMoveKind::MoveSouth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareWest_clicked(){
    this->addMoveStepSquare(CommandMoveKind::MoveWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareEast_clicked(){
    this->addMoveStepSquare(CommandMoveKind::MoveEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareNorthWest_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveNorthWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareNorthEast_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveNorthEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouthWest_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveSouthWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouthEast_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveSouthEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareRandom_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveRandom);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareHero_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveHero);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareOppositeHero_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveOppositeHero);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareFront_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveFront);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareBack_clicked() {
    this->addMoveStepSquare(CommandMoveKind::MoveBack);
}
