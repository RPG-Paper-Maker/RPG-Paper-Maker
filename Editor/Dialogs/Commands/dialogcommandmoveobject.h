/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDMOVEOBJECT_H
#define DIALOGCOMMANDMOVEOBJECT_H

#include "dialogcommand.h"
#include "commandmovekind.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandMoveObject
//
//  A dialog used for moving an object.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandMoveObject;
}

class DialogCommandMoveObject : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandMoveObject(EventCommand *command = nullptr,
        QStandardItemModel* properties = nullptr, QStandardItemModel* parameters
        = nullptr, bool idObjectFixed = false, QWidget *parent = nullptr);
    virtual ~DialogCommandMoveObject();

    void translate();
    void initializePrimitives();
    void addMoveStepSquare(CommandMoveKind kind);
    void addMoveEmpty(CommandMoveKind kind);
    void addMove(QVector<QString> &commands);

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandMoveObject *ui;
    QStandardItemModel *m_modelObjects;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    bool m_idObjectFixed;

private slots:
    void on_pushButtonStepSquareNorth_clicked();
    void on_pushButtonStepSquareSouth_clicked();
    void on_pushButtonStepSquareWest_clicked();
    void on_pushButtonStepSquareEast_clicked();
    void on_pushButtonStepSquareNorthWest_clicked();
    void on_pushButtonStepSquareNorthEast_clicked();
    void on_pushButtonStepSquareSouthWest_clicked();
    void on_pushButtonStepSquareSouthEast_clicked();
    void on_pushButtonStepSquareRandom_clicked();
    void on_pushButtonStepSquareHero_clicked();
    void on_pushButtonStepSquareOppositeHero_clicked();
    void on_pushButtonStepSquareFront_clicked();
    void on_pushButtonStepSquareBack_clicked();
    void on_pushButtonJump_clicked();
    void on_pushButtonTurnNorth_clicked();
    void on_pushButtonTurnSouth_clicked();
    void on_pushButtonTurnWest_clicked();
    void on_pushButtonTurnEast_clicked();
    void on_pushButtonTurn90Right_clicked();
    void on_pushButtonTurn90Left_clicked();
    void on_pushButtonLookAtHero_clicked();
    void on_pushButtonLookAtHeroOpposite_clicked();
    void on_pushButtonChangeGraphics_clicked();
};

#endif // DIALOGCOMMANDMOVEOBJECT_H
