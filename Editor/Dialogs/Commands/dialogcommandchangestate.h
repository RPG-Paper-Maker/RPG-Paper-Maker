/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGESTATE_H
#define DIALOGCOMMANDCHANGESTATE_H

#include "dialogcommand.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeState
//
//  A dialog used for changing the state of one or several objects.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeState;
}

class DialogCommandChangeState : public DialogCommand
{
    Q_OBJECT

public:
     DialogCommandChangeState(EventCommand *command = nullptr,
                              QStandardItemModel *properties = nullptr,
                              QStandardItemModel *parameters = nullptr,
                              QWidget *parent = nullptr);
     virtual ~DialogCommandChangeState();
     EventCommand * getCommand() const;

protected:
     void initializeMaps();
     void initializeMapsInfos(QStandardItem *item, QString path, int level);
     void initializeObjects(int id, bool isCurrentMap);

     virtual void initialize(EventCommand* command);

private:
     Ui::DialogCommandChangeState *ui;
     QStandardItemModel *m_properties;
     QStandardItemModel *m_parameters;
     QStandardItemModel *m_modelMaps;
     QStandardItemModel *m_modelObjects;

     void initializeStateId();
     void selectionState(QVector<QString>& command) const;
     void operation(QVector<QString>& command) const;
     void translate();

public slots:
     void on_mapIDUpdated(int i);
};

#endif // DIALOGCOMMANDCHANGESTATE_H

