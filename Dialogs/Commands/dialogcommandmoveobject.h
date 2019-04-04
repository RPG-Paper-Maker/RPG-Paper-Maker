/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
