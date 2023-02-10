/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogchangegraphics.h"
#include "dialogcommandmoveobject.h"
#include "ui_dialogcommandmoveobject.h"
#include "systemcommandmove.h"
#include "dialogjump.h"
#include "dialogcommandwait.h"
#include "dialogcommandplaysong.h"
#include "dialogcommandscript.h"
#include "dialognumber.h"
#include "rpm.h"
#include "mainwindow.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandMoveObject::DialogCommandMoveObject(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters,
    SystemCommonObject *object, bool idObjectFixed, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveObject),
    m_modelObjects(nullptr),
    m_properties(properties),
    m_parameters(parameters),
    m_object(object),
    m_idObjectFixed(idObjectFixed)
{
    ui->setupUi(this);
    connect(ui->treeView, SIGNAL(needsUpdateJson(SuperListItem *)),
        this, SLOT(on_updateJsonMoves(SuperListItem *)));
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    ui->treeView->getModel()->appendRow(SuperListItem::getEmptyItem());
    ui->treeView->setCurrentIndex(ui->treeView->getModel()->index(0, 0));
    ui->treeView->setPasteBeforeSelected(true);
    on_updateJsonMoves(nullptr);

    this->translate();
}

DialogCommandMoveObject::~DialogCommandMoveObject()
{
    if (this->parent() != nullptr)
    {
        MainWindow::get()->mapEditor()->clearWayPreview();
    }
    SuperListItem::deleteModel(ui->treeView->getModel());
    delete ui;
    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandMoveObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::MOVE_OBJECT) + RPM::DOT_DOT_DOT);
    ui->labelObjectID->setText(RPM::translate(Translations::OBJECT_ID) + RPM::COLON);
    ui->labelChangeDirection->setText(RPM::translate(Translations::CHANGE_DIRECTION)
        + RPM::COLON);
    ui->labelStepSquareMoves->setText(RPM::translate(Translations::STEP_SQUARE_MOVES)
        + RPM::COLON);
    ui->labelChangeObjectProperties->setText(RPM::translate(Translations::CHANGE_OBJECT_OPTIONS)
        + RPM::COLON);
    ui->checkBoxIgnore->setText(RPM::translate(Translations::IGNORE_IF_IMPOSSIBLE));
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations::WAIT_END));
    ui->checkBoxCameraOrientation->setText(RPM::translate(Translations::WITH_CAMERA_ORIENTATION));
    ui->pushButtonStepSquareBack->setText(RPM::translate(Translations::ONE_BACK));
    ui->pushButtonStepSquareEast->setText(RPM::translate(Translations::ONE_TO_EAST));
    ui->pushButtonStepSquareHero->setText(RPM::translate(Translations::ONE_TO_HERO));
    ui->pushButtonStepSquareWest->setText(RPM::translate(Translations::ONE_TO_WEST));
    ui->pushButtonStepSquareFront->setText(RPM::translate(Translations::ONE_IN_FRONT));
    ui->pushButtonStepSquareNorth->setText(RPM::translate(Translations::ONE_TO_NORTH));
    ui->pushButtonStepSquareSouth->setText(RPM::translate(Translations::ONE_TO_SOUTH));
    ui->pushButtonStepSquareRandom->setText(RPM::translate(Translations::ONE_TO_RANDOME));
    ui->pushButtonStepSquareNorthEast->setText(RPM::translate(Translations::ONE_TO_NORTH_EAST));
    ui->pushButtonStepSquareNorthWest->setText(RPM::translate(Translations::ONE_TO_NORTH_WEST));
    ui->pushButtonStepSquareSouthEast->setText(RPM::translate(Translations::ONE_TO_SOUTH_EAST));
    ui->pushButtonStepSquareSouthWest->setText(RPM::translate(Translations::ONE_TO_SOUTH_WEST));
    ui->pushButtonStepSquareOppositeHero->setText(RPM::translate(Translations::ONE_OPPOSITE_TO_HERO));
    ui->pushButtonChangeGraphics->setText(RPM::translate(Translations ::CHANGE_GRAPHICS) + RPM::DOT_DOT_DOT);
    ui->checkBoxPermanent->setText(RPM::translate(Translations::PERMANENT));
    ui->groupBoxMoves->setTitle(RPM::translate(Translations::MOVES));
    ui->pushButtonJump->setText(RPM::translate(Translations::JUMP) + RPM::DOT_DOT_DOT);
    ui->pushButtonTurnNorth->setText(RPM::translate(Translations::TURN_NORTH));
    ui->pushButtonTurnSouth->setText(RPM::translate(Translations::TURN_SOUTH));
    ui->pushButtonTurnWest->setText(RPM::translate(Translations::TURN_WEST));
    ui->pushButtonTurnEast->setText(RPM::translate(Translations::TURN_EAST));
    ui->pushButtonTurn90Right->setText(RPM::translate(Translations::TURN_90_RIGHT));
    ui->pushButtonTurn90Left->setText(RPM::translate(Translations::TURN_90_LEFT));
    ui->pushButtonLookAtHero->setText(RPM::translate(Translations::LOOK_AT_HERO));
    ui->pushButtonLookAtHeroOpposite->setText(RPM::translate(Translations::LOOK_AT_HERO_OPPOSITE));
    ui->pushButtonChangeSpeed->setText(RPM::translate(Translations::CHANGE_SPEED) + RPM::DOT_DOT_DOT);
    ui->pushButtonChangeFrequency->setText(RPM::translate(Translations::CHANGE_FREQUENCY) + RPM::DOT_DOT_DOT);
    ui->pushButtonMoveAnimation->setText(RPM::translate(Translations::MOVE_ANIMATION));
    ui->pushButtonStopAnimation->setText(RPM::translate(Translations::STOP_ANIMATION));
    ui->pushButtonClimbAnimation->setText(RPM::translate(Translations::CLIMB_ANIMATION));
    ui->pushButtonFixDirection->setText(RPM::translate(Translations::DIRECTION_FIX));
    ui->pushButtonThrough->setText(RPM::translate(Translations::THROUGH));
    ui->pushButtonSetWithCamera->setText(RPM::translate(Translations::SET_WITH_CAMERA));
    ui->pushButtonPixelOffset->setText(RPM::translate(Translations::PIXEL_OFFSET));
    ui->pushButtonKeepPosition->setText(RPM::translate(Translations::KEEP_POSITION));
    ui->pushButtonWait->setText(RPM::translate(Translations::WAIT) + RPM::DOT_DOT_DOT);
    ui->pushButtonPlaySound->setText(RPM::translate(Translations::PLAY_A_SOUND) + RPM::DOT_DOT_DOT);
    ui->pushButtonScript->setText(RPM::translate(Translations::SCRIPT) + RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandMoveObject::initializePrimitives()
{
    QSizePolicy sp_retain;
    sp_retain = ui->pushButtonEmpty->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->pushButtonEmpty->setSizePolicy(sp_retain);
    ui->pushButtonEmpty->hide();
    if (m_idObjectFixed)
    {
        ui->labelObjectID->hide();
        ui->widgetPrimitiveObjectID->hide();
        ui->horizontalSpacer->changeSize(0, 0);
    }
    // Model objects
    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else
    {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->widgetPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
        m_parameters, m_properties);

    // Empty tree of move commands
    QStandardItemModel *model = new QStandardItemModel;
    ui->treeView->initializeModel(model);
    ui->treeView->setHasContextMenu(true);
    ui->treeView->setCanBeEmpty(true);
    ui->comboBoxStepSquare->addItem(RPM::translate(Translations::SQUARE));
    ui->comboBoxStepSquare->addItem(RPM::translate(Translations::STEP));
}

// -------------------------------------------------------

void DialogCommandMoveObject::addMoveStepSquare(CommandMoveKind kind)
{
    ui->treeView->getModel()->insertRow(ui->treeView->getSelected()->row(), (new
        SystemCommandMove(-1, "", QVector<QString>({QString::number(static_cast<
        int>(kind)), QString::number(ui->comboBoxStepSquare->currentIndex())}),
        m_properties, m_parameters))->getModelRow());
    this->on_updateJsonMoves(nullptr);
}

// -------------------------------------------------------

void DialogCommandMoveObject::addMoveEmpty(CommandMoveKind kind)
{
    QVector<QString> commands = QVector<QString>({QString::number(static_cast
        <int>(kind))});
    this->addMove(commands);
}

// -------------------------------------------------------

void DialogCommandMoveObject::addMoveOnOffPermanent(CommandMoveKind kind)
{
    QVector<QString> commands = QVector<QString>({QString::number(static_cast
        <int>(kind)), RPM::boolToString(ui->comboBoxSwitch->currentIndex() == 0),
        RPM::boolToString(ui->checkBoxPermanent->isChecked())});
    this->addMove(commands);
}

// -------------------------------------------------------

void DialogCommandMoveObject::addMove(QVector<QString> &commands)
{
    ui->treeView->getModel()->insertRow(ui->treeView->getSelected()->row(), (new
        SystemCommandMove(-1, "", commands, m_properties, m_parameters))
        ->getModelRow());
    this->on_updateJsonMoves(nullptr);
}

// -------------------------------------------------------

EventCommand * DialogCommandMoveObject::getCommand() const
{
    QVector<QString> command;

    // Object ID
    ui->widgetPrimitiveObjectID->getCommand(command);

    // Options
    command.append(ui->checkBoxIgnore->isChecked() ? "1" : "0");
    command.append(ui->checkBoxWaitEnd->isChecked() ? "1" : "0");
    command.append(ui->checkBoxCameraOrientation->isChecked() ? "1" : "0");

    // List of move commands
    SystemCommandMove *move;
    for (int i = 0, l = ui->treeView->getModel()->invisibleRootItem()->rowCount();
        i < l; i++)
    {
        move = reinterpret_cast<SystemCommandMove *>(SuperListItem::getItemModelAt(
            ui->treeView->getModel(), i));
        if (move != nullptr)
        {
            move->getCommand(command);
        }
    }
    return new EventCommand(EventCommandKind::MoveObject, command);
}

// -------------------------------------------------------

void DialogCommandMoveObject::initialize(EventCommand *command)
{
    int i = 0;

    // Object ID
    ui->widgetPrimitiveObjectID->initializeCommand(command, i);

    // Options
    ui->checkBoxIgnore->setChecked(command->valueCommandAt(i++) == "1");
    ui->checkBoxWaitEnd->setChecked(command->valueCommandAt(i++) == "1");
    ui->checkBoxCameraOrientation->setChecked(command->valueCommandAt(i++) == "1");

    // List of move commands
    SystemCommandMove *move;
    while(i < command->commandsCount())
    {
        move = new SystemCommandMove;
        move->initialize(command, i);
        ui->treeView->getModel()->appendRow(move->getModelRow());
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareNorth_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveNorth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouth_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveSouth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareWest_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareEast_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareNorthWest_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveNorthWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareNorthEast_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveNorthEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouthWest_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveSouthWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareSouthEast_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveSouthEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareRandom_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveRandom);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareHero_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveHero);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareOppositeHero_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveOppositeHero);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareFront_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveFront);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStepSquareBack_clicked()
{
    this->addMoveStepSquare(CommandMoveKind::MoveBack);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonJump_clicked()
{
    DialogJump dialog(m_properties, m_parameters);
    if (dialog.exec() == QDialog::Accepted)
    {
        QVector<QString> command = QVector<QString>({ QString::number(static_cast
            <int>(CommandMoveKind::Jump)), QString::number(ui->comboBoxStepSquare
            ->currentIndex())});
        dialog.getCommand(command);
        this->addMove(command);
    }
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonTurnNorth_clicked()
{
    this->addMoveEmpty(CommandMoveKind::TurnNorth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonTurnSouth_clicked()
{
    this->addMoveEmpty(CommandMoveKind::TurnSouth);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonTurnWest_clicked()
{
    this->addMoveEmpty(CommandMoveKind::TurnWest);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonTurnEast_clicked()
{
    this->addMoveEmpty(CommandMoveKind::TurnEast);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonTurn90Right_clicked()
{
    this->addMoveEmpty(CommandMoveKind::Turn90Right);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonTurn90Left_clicked()
{
    this->addMoveEmpty(CommandMoveKind::Turn90Left);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonLookAtHero_clicked()
{
    this->addMoveEmpty(CommandMoveKind::LookAtHero);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonLookAtHeroOpposite_clicked()
{
    this->addMoveEmpty(CommandMoveKind::LookAtHeroOpposite);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonChangeSpeed_clicked()
{
    PrimitiveValue *value = PrimitiveValue::createDefaultDataBaseValue();
    value->setModelDataBase(RPM::get()->project()->gameDatas()->systemDatas()->modelSpeed());
    value->setModelParameter(m_parameters);
    value->setModelProperties(m_properties);
    DialogNumber dialog(value, RPM::translate(Translations::CHANGE_SPEED) + RPM
        ::DOT_DOT_DOT, RPM::translate(Translations::SPEED) + RPM::COLON);
    if (dialog.exec() == QDialog::Accepted)
    {
        QVector<QString> commands = QVector<QString>({QString::number(static_cast
            <int>(CommandMoveKind::ChangeSpeed)), RPM::boolToString(ui->
            checkBoxPermanent->isChecked())});
        value->getCommandParameter(commands);
        this->addMove(commands);
    }
    delete value;
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonChangeFrequency_clicked()
{
    PrimitiveValue *value = PrimitiveValue::createDefaultDataBaseValue();
    value->setModelDataBase(RPM::get()->project()->gameDatas()->systemDatas()->modelFrequencies());
    value->setModelParameter(m_parameters);
    value->setModelProperties(m_properties);
    DialogNumber dialog(value, RPM::translate(Translations::CHANGE_FREQUENCY) +
        RPM::DOT_DOT_DOT, RPM::translate(Translations::FREQUENCY) + RPM::COLON);
    if (dialog.exec() == QDialog::Accepted)
    {
        QVector<QString> commands = QVector<QString>({QString::number(static_cast
            <int>(CommandMoveKind::ChangeFrequency)), RPM::boolToString(ui->
            checkBoxPermanent->isChecked())});
        value->getCommandParameter(commands);
        this->addMove(commands);
    }
    delete value;
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonMoveAnimation_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::MoveAnimation);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonStopAnimation_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::StopAnimation);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonClimbAnimation_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::ClimbAnimation);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonFixDirection_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::FixDirection);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonThrough_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::Through);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonSetWithCamera_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::SetWithCamera);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonPixelOffset_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::PixelOffset);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonKeepPosition_clicked()
{
    this->addMoveOnOffPermanent(CommandMoveKind::KeepPosition);
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonChangeGraphics_clicked()
{
    PrimitiveValue value(1);
    DialogChangeGraphics dialog(&value, m_properties, m_parameters);
    if (dialog.exec() == QDialog::Accepted)
    {
        QVector<QString> commands = QVector<QString>({QString::number(static_cast
            <int>(CommandMoveKind::ChangeGraphics)), RPM::boolToString(ui
            ->checkBoxPermanent->isChecked())});
        commands.append(RPM::boolToString(dialog.dontChangeOrientation()));
        commands.append(QString::number(dialog.getIndex()));
        if (dialog.isValueID())
        {
            value.getCommandParameter(commands, true);
        } else
        {
            PrimitiveValue valueFix(PrimitiveValueKind::Number, dialog.id());
            valueFix.getCommandParameter(commands, true);
        }
        if (!dialog.isValueID() && dialog.id() == 0)
        {
            QRect rect = dialog.currentRect();
            commands.append(QString::number(rect.x()));
            commands.append(QString::number(rect.y()));
            commands.append(QString::number(rect.width()));
            commands.append(QString::number(rect.height()));
        } else
        {
            commands.append(QString::number(dialog.indexX()));
            commands.append(QString::number(dialog.indexY()));
            commands.append("1");
            commands.append("1");
        }
        this->addMove(commands);
    }
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonWait_clicked()
{
    DialogCommandWait dialog(nullptr, m_properties, m_parameters);
    if (dialog.exec() == QDialog::Accepted)
    {
        QVector<QString> commands = QVector<QString>({QString::number(static_cast
            <int>(CommandMoveKind::Wait))});
        dialog.getCommandList(commands);
        this->addMove(commands);
    }
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonPlaySound_clicked()
{
    DialogCommandPlaySong dialog(RPM::translate(Translations::PLAY_A_SOUND) +
        RPM::DOT_DOT_DOT, SongKind::Sound, nullptr, m_properties, m_parameters);
    if (dialog.exec() == QDialog::Accepted)
    {
        QVector<QString> commands = QVector<QString>({QString::number(static_cast
            <int>(CommandMoveKind::PlayASound))});
        dialog.getCommandList(commands);
        this->addMove(commands);
    }
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_pushButtonScript_clicked()
{
    DialogCommandScript dialog(nullptr, m_properties, m_parameters);
    if (dialog.exec() == QDialog::Accepted)
    {
       QVector<QString> commands = QVector<QString>({QString::number(static_cast
           <int>(CommandMoveKind::Script))});
       dialog.getCommandList(commands);
       this->addMove(commands);
    }
}

// -------------------------------------------------------

void DialogCommandMoveObject::on_updateJsonMoves(SuperListItem *)
{
    Map *map = RPM::get()->project()->currentMap(true);
    if (map != nullptr && m_object != nullptr) {
        Position3D pos = map->getObjectPosition(m_object->id());
        // If not existing, use cursor position
        if (pos.x() == -1 && RPM::get()->controlMapEditor() && RPM::get()->controlMapEditor()->cursorObject())
        {
            pos.setX(RPM::get()->controlMapEditor()->cursorObject()->getSquareX());
            pos.setY(RPM::get()->controlMapEditor()->cursorObject()->getSquareY());
            pos.setZ(RPM::get()->controlMapEditor()->cursorObject()->getSquareZ());
            pos.setYPlus(RPM::get()->controlMapEditor()->cursorObject()->getYPlus());
        }
        QList<OrientationKind> orientations;
        SystemCommandMove *move;
        for (int i = 0, l = ui->treeView->getModel()->invisibleRootItem()->rowCount();
            i < l; i++)
        {
            move = reinterpret_cast<SystemCommandMove *>(SuperListItem::getItemModelAt(
                ui->treeView->getModel(), i));
            if (move != nullptr)
            {
                CommandMoveKind kind = move->getKind();
                switch (kind) {
                case CommandMoveKind::MoveSouth:
                    orientations.append(OrientationKind::South);
                    break;
                case CommandMoveKind::MoveWest:
                    orientations.append(OrientationKind::West);
                    break;
                case CommandMoveKind::MoveNorth:
                    orientations.append(OrientationKind::North);
                    break;
                case CommandMoveKind::MoveEast:
                    orientations.append(OrientationKind::East);
                    break;
                case CommandMoveKind::MoveSouthWest:
                    orientations.append(OrientationKind::South);
                    orientations.append(OrientationKind::West);
                    break;
                case CommandMoveKind::MoveSouthEast:
                    orientations.append(OrientationKind::South);
                    orientations.append(OrientationKind::East);
                    break;
                case CommandMoveKind::MoveNorthWest:
                    orientations.append(OrientationKind::North);
                    orientations.append(OrientationKind::West);
                    break;
                case CommandMoveKind::MoveNorthEast:
                    orientations.append(OrientationKind::North);
                    orientations.append(OrientationKind::East);
                    break;
                default:
                    break;
                }
            }
        }
        if (this->parent() != nullptr)
        {
            MainWindow::get()->mapEditor()->updateWayPreview(pos, orientations);
            reinterpret_cast<QDialog *>(this->parent())->setWindowOpacity(orientations.isEmpty() ? 1 : 0);
        }
    }
}
