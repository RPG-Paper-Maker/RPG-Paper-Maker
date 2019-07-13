/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
                                     SystemCommonObject *object = nullptr,
                                     QStandardItemModel* parameters = nullptr,
                                     QWidget *parent = 0);
    virtual ~DialogCommandMoveObject();
    EventCommand* getCommand() const;
    void addMoveStepSquare(CommandMoveKind kind);

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandMoveObject *ui;
    QStandardItemModel* m_modelObjects;

private slots:
    void on_pushButtonStepSquareNorth_clicked();
    void on_pushButtonStepSquareSouth_clicked();
    void on_pushButtonStepSquareWest_clicked();
    void on_pushButtonStepSquareEast_clicked();
};

#endif // DIALOGCOMMANDMOVEOBJECT_H
